import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/common/strategies/accessToken.strategy';
import { JwtCreationCommand } from '../commands/login/impl/jwt-cration.command';
import { LogoutCommand } from '../commands/logout/impl/logout.command';
import { OtpUpdatingAndSavingCommandr } from '../commands/update-otp/impl/otp-updating-and-saving.command';
import { VerifyUserCommand } from '../commands/verify-user/impl/verify-user.command';
import { SingInAuthUserDto } from '../dto/create/create-auth.dto';
import { LoginAuthDto } from '../dto/login/login-auth.dto';
import { Otp } from '../entities/otp.entity';
import { User } from '../entities/user.entity';
import { LoginCheckingUserQuery } from '../queries/login/impl/login-checking-user.query';
import { ReceivingAndCheckingJwtQuery } from '../queries/refresh/impl/receiving-and-checking-jwt.query';
import { ReceivingAndCheckingOtpQuery } from '../queries/verify-otp/impl/receiving-and-checking.query';
import { SendCodeService } from './sendCode.service';
import { OtpCreationAndSavingCommand } from '../commands/singIn/user/impl/otp-creation-and-saving.command';
import { UserCreationCommand } from '../commands/singIn/user/impl/user-creation.command';
import { AdminCreationCommand } from '../commands/singIn/admin/impl/admin-creation.command';
import { Roles } from '../enums/roles-enum';
import { RepeatSendCode } from '../dto/rapeatCode/repeat-code.dto';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly sendCodeService: SendCodeService,
    private readonly logger: MyLogger,
  ) {}

  async singInUser(singInAuthDto: SingInAuthUserDto): Promise<User> {
    const { registrationMethod, email, phone } = singInAuthDto;
    try {
      // creation new user
      const user: User = await this.commandBus.execute(
        new UserCreationCommand(singInAuthDto),
      );

      // OTP creating and saving  in DB
      const otp = await this.commandBus.execute(
        new OtpCreationAndSavingCommand(user.id),
      );

      //running a service that adds a massage to the massage queue
      await this.sendCodeService.send({
        registrationMethod,
        email,
        phone,
        otp: otp.otp,
      });

      return user;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Server Error');
      }
    }
  }

  async singInAdmin(singInAuthDto: SingInAuthUserDto): Promise<User> {
    const { registrationMethod, email, phone } = singInAuthDto;

    try {
      // creation new user
      const user: User = await this.commandBus.execute(
        new AdminCreationCommand({ ...singInAuthDto, role: Roles.Admin }),
      );

      // OTP creating and saving  in DB
      const otp = await this.commandBus.execute(
        new OtpCreationAndSavingCommand(user.id),
      );

      //running a service that adds a massage to the massage queue
      await this.sendCodeService.send({
        registrationMethod,
        email,
        phone,
        otp: otp.otp,
      });

      return user;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Server Error');
      }
    }
  }

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { registrationMethod, email, phone, password } = loginAuthDto;
    try {
      //get user by email or phone
      const user: User | null = await this.queryBus.execute(
        new LoginCheckingUserQuery(registrationMethod, phone, email),
      );

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) throw new BadRequestException('Password is incorrect');

      // tokens creation
      const tokens = await this.commandBus.execute(
        new JwtCreationCommand(user.id, user.role),
      );

      return tokens;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Server Error');
      }
    }
  }

  async logout(userId: number): Promise<void> {
    // refresh token removal
    await this.commandBus.execute(new LogoutCommand(userId)).catch((error) => {
      this.logger.error(`Logout Command ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }

  async refresh(
    user: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      //recieve token from DB
      const checking = await this.queryBus.execute(
        new ReceivingAndCheckingJwtQuery(user),
      );
      if (checking) {
        // creation new tokens and insert token in DB
        return await this.commandBus.execute(
          new JwtCreationCommand(user.id, user.role),
        );
      }
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`);

      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Server Error');
      }
    }
  }

  async verify(otp: string): Promise<void> {
    try {
      // recieve otp
      const verificationCode: Otp | null = await this.queryBus.execute(
        new ReceivingAndCheckingOtpQuery(otp),
      );

      // remove Otp, update a user in the database, making it verified
      await this.commandBus.execute(
        new VerifyUserCommand(verificationCode.otp, verificationCode.userId),
      );
      return;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Server Error');
      }
    }
  }

  async repeatCode(repeatSendCode: RepeatSendCode): Promise<void> {
    const { registrationMethod, email, phone } = repeatSendCode;

    // recieve user
    const user: User | null = await this.queryBus.execute(
      new LoginCheckingUserQuery(registrationMethod, phone, email),
    );

    // check user
    if (user.isVerified) throw new BadRequestException('Bad Request');

    // update otp in DB
    const otp = await this.commandBus
      .execute(new OtpUpdatingAndSavingCommandr(user.id))
      .catch((error) => {
        console.log(error);
      });
    //send mуssage
    await this.sendCodeService.send({ ...repeatSendCode, otp });
    return;
  }
}
