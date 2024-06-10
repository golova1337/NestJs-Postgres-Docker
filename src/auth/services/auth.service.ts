import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SingInAuthDto } from '../dto/create-auth.dto';
import { AuthRepository } from '../repository/user-repository';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { JwtTokenService } from './jwt.service';
import { JwtRepository } from '../repository/jwt-repository';
import { JwtPayload } from 'src/common/strategies/accessToken.strategy';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { verifyCode } from 'src/utils/verify/verify';
import { VerificationRepository } from '../repository/verification-repository';

@Injectable()
export class AuthService {
  private readonly logger = new EmojiLogger();
  constructor(
    @InjectQueue('phone-sms') private phoneSmsQueue: Queue,
    @InjectQueue('email-sms') private emailSmsQueue: Queue,
    private readonly authRepository: AuthRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly jwtRepository: JwtRepository,
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async create(singInAuthDto: SingInAuthDto): Promise<User> {
    singInAuthDto.password = await bcrypt
      .hash(singInAuthDto.password, 10)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Server Error');
      });

    delete singInAuthDto.passwordRepeat;

    const verificationCode = await verifyCode();

    switch (singInAuthDto.registrationMethod) {
      case 'email':
        await this.emailSmsQueue.add(
          'email',
          {
            email: singInAuthDto.email,
            code: verificationCode,
          },
          { delay: 3000, priority: 1 },
        );
        break;
      case 'phone':
        await this.phoneSmsQueue.add(
          'phone',
          {
            phone: singInAuthDto.numbers,
            code: verificationCode,
          },
          { delay: 3000, priority: 1 },
        );
      default:
        break;
    }

    const user: User = await this.authRepository
      .create(singInAuthDto)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Server Error');
      });
    delete user.dataValues.password;

    await this.verificationRepository.create({
      verificationCode,
      userId: user.id,
    });

    return user;
  }

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user: User;
    switch (loginAuthDto.registrationMethod) {
      case 'phone':
        user = await this.authRepository.findOneByPhone(loginAuthDto.numbers);
        break;
      case 'email':
        user = await this.authRepository.findOneByEmail(loginAuthDto.email);
        break;

      default:
        throw new BadRequestException('Bad Request');
    }

    const { accessToken, refreshToken } = await this.jwtTokenService
      .getTokens(user.id, user.role)
      .catch((error) => {
        this.logger.error(`getTokens : ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    const hashToken = await this.jwtTokenService.hashData(refreshToken);

    await this.jwtRepository.update(user.id, hashToken).catch((error) => {
      this.logger.error(`create jwt: ${error}`);
      throw new InternalServerErrorException('Server Error');
    });

    return { accessToken, refreshToken };
  }

  async logout(userId: number): Promise<void> {
    await this.jwtRepository.remove(userId).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async refresh(jwtPayload: JwtPayload) {
    const { id, role, refreshToken } = jwtPayload;
    const user = await this.jwtRepository
      .findOne(+id, refreshToken)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Server Error');
      });

    if (!user || !user.token) throw new UnauthorizedException('Unauthorized');
    const compare = await this.jwtTokenService
      .compare(refreshToken, user.token)
      .catch((error) => {
        throw new InternalServerErrorException('Server Error');
      });

    if (!compare) {
      throw new UnauthorizedException('Unauthorized');
    }

    const tokens = await this.jwtTokenService
      .getTokens(+id, role)
      .catch((error) => {
        throw new InternalServerErrorException('Server Error');
      });

    const hashToken = await this.jwtTokenService.hashData(tokens.refreshToken);

    const result = await this.jwtRepository.update(+id, hashToken);
    return tokens;
  }

  async remove(id: number, password: string): Promise<void> {
    const user: User = await this.authRepository.finbByPk(id).catch((error) => {
      this.logger.error(`user: ${error}`);
      throw new InternalServerErrorException('Server Error');
    });

    const compare: boolean = await bcrypt
      .compare(password, user.password)
      .catch((error) => {
        this.logger.error(`compare: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    if (!compare) throw new BadRequestException('Password is incorect');

    await this.authRepository.remove(id).catch((error) => {
      this.logger.error(`remove: ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }
}
