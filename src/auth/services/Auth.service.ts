import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { JwtPayload } from 'src/common/strategies/accessToken.strategy';
import { InsertJwtCommand } from '../commands/login/impl/Create-jwt.command';
import { LogoutCommand } from '../commands/logout/impl/Logout.command';
import { CreateOtpCommand } from '../commands/singIn/impl/Create-otp.command';
import { UserCreateCommand } from '../commands/singIn/impl/Create-user.command';
import { MakeUserVerified } from '../commands/verify-otp/impl/Make-user-verified.command';
import { SingInAuthDto } from '../dto/create/create-auth.dto';
import { LoginAuthDto } from '../dto/login/login-auth.dto';
import { RepeatSendCode } from '../dto/rapeatCode/Repeat-code.dto';
import { Jwt } from '../entities/Jwt.entity';
import { Otp } from '../entities/Otp.entity';
import { User } from '../entities/User.entity';
import { LoginCheckUserQuery } from '../queries/login/impl/Login-check-user.query';
import { RefreshQuery } from '../queries/refresh/impl/Refresh.query';
import { CheckOtpQuery } from '../queries/verify-otp/impl/Check-verification-code.query';
import { JwtTokenService } from './Jwt.service';
import { OtpService } from './Otp.service';
import { SendCodeService } from './SendCode.service';

@Injectable()
export class AuthService {
  logger = new EmojiLogger();
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly sendCodeService: SendCodeService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly otpService: OtpService,
  ) {}
  async singIn(singInAuthDto: SingInAuthDto): Promise<User> {
    let { registrationMethod, password, name, lastname, email, phone } =
      singInAuthDto;

    password = await bcrypt.hash(password, 10);
    // creation new user
    const user: User = await this.commandBus
      .execute(
        new UserCreateCommand(
          registrationMethod,
          password,
          name,
          lastname,
          email,
          phone,
        ),
      )
      .catch((error) => {
        this.logger.error(`create user: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    // creating otp
    const generateOtp: string = await this.otpService.generateOtp();
    // saving in DB
    await this.commandBus
      .execute(new CreateOtpCommand(user.id, generateOtp))
      .catch((error) => {
        this.logger.error(`create otpRepository: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    delete user.dataValues.password;
    //running a service that adds a massage to the massage queue
    this.sendCodeService.send({
      registrationMethod,
      email,
      phone,
      otp: generateOtp,
    });

    return user;
  }

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { registrationMethod, email, phone, password } = loginAuthDto;

    //get user by email or phone
    const user: User | null = await this.queryBus
      .execute(new LoginCheckUserQuery(registrationMethod, phone, email))
      .catch((error) => {
        this.logger.error(`Login QueryHandler ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) throw new BadRequestException('Bad Request');

    const { accessToken, refreshToken } = await this.jwtTokenService.getTokens(
      user.id,
      user.role,
    );
    const hashToken = await this.jwtTokenService.hashData(refreshToken);

    // tokens creation
    await this.commandBus
      .execute(new InsertJwtCommand(user.id, hashToken))
      .catch((error) => {
        this.logger.error(`getTokens : ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    // refresh token removal
    await this.commandBus.execute(new LogoutCommand(+userId)).catch((error) => {
      this.logger.error(`Logout Command ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }

  async refresh(
    user: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id, role, refreshToken } = user;
    //recieve token from DB
    const token: Jwt | null = await this.queryBus
      .execute(new RefreshQuery(id))
      .catch((error) => {
        this.logger.error(`Refresh Query ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    const compare = await this.jwtTokenService
      .compare(refreshToken, token.token)
      .catch((error) => {
        this.logger.error(`Compare ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    if (!compare || !token) throw new UnauthorizedException('Unauthorized');

    const tokens: {
      accessToken: string;
      refreshToken: string;
    } = await this.jwtTokenService.getTokens(id, role);

    const hashToken: string = await this.jwtTokenService.hashData(
      tokens.refreshToken,
    );

    // insert token in DB
    await this.commandBus.execute(new InsertJwtCommand(id, hashToken));
    return tokens;
  }

  async verify(otp: string): Promise<void> {
    // recieve otp
    const verificationCode: Otp | null = await this.queryBus
      .execute(new CheckOtpQuery(otp))
      .catch((error) => {
        this.logger.error(`verificationCode query ${error}`);
      });
    const validateOtp: boolean = await this.otpService.validateOtp(
      verificationCode.otp,
      otp,
    );
    const isOtpExpired: boolean = await this.otpService.isOtpExpired(
      verificationCode.otpExpiresAt,
    );

    if (!validateOtp || !!isOtpExpired)
      throw new BadRequestException('Bad Request');

    // remove Otp, update a user in the database, making it verified
    await this.commandBus
      .execute(
        new MakeUserVerified(verificationCode.otp, verificationCode.userId),
      )
      .catch((err) => {
        this.logger.error(`setNull:${err}`);
        throw new InternalServerErrorException('Server Error');
      });
    return;
  }

  async repeatCode(repeatSendCode: RepeatSendCode): Promise<void> {
    const { registrationMethod, email, phone } = repeatSendCode;
    // recieve user
    const user: User | null = await this.queryBus.execute(
      new LoginCheckUserQuery(registrationMethod, phone, email),
    );
    // check user
    if (!user || user.isVerified) throw new BadRequestException('Bad Request');

    //generat eOtp
    const generateOtp: string = await this.otpService.generateOtp();

    // update otp in DB
    const otp = await this.commandBus.execute(
      new CreateOtpCommand(user.id, generateOtp),
    );
    //send mуssage
    await this.sendCodeService.send({ ...repeatSendCode, otp });
    return;
  }
}
