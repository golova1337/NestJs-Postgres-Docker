import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SingInAuthDto } from '../dto/create-auth.dto';
import { AuthRepository } from '../repository/auth-repository';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { JwtTokenService } from './jwt.service';
import { JwtRepository } from '../repository/jwt-repository';
import { JwtPayload } from 'src/common/strategies/accessToken.strategy';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { VerificationRepository } from '../repository/verification-repository';
import { SendCodeService } from './sendCode.service';

@Injectable()
export class AuthService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly sendCodeService: SendCodeService,
    private readonly authRepository: AuthRepository,
    private readonly jwtRepository: JwtRepository,
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async create(singInAuthDto: SingInAuthDto): Promise<{ data: User }> {
    singInAuthDto.password = await bcrypt
      .hash(singInAuthDto.password, 10)
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Server Error');
      });

    delete singInAuthDto.passwordRepeat;

    const user: User = await this.authRepository
      .create(singInAuthDto)
      .catch((error) => {
        this.logger.error(`create user: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    delete user.dataValues.password;
    return { data: user };
  }

  async isVerified(id: number) {
    await this.authRepository.isVerified(id).catch((err) => {
      this.logger.error(`verificationCodes:${err}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async login(loginAuthDto: LoginAuthDto): Promise<{
    data: { accessToken: string; refreshToken: string };
  }> {
    let user: User;
    switch (loginAuthDto.registrationMethod) {
      case 'phone':
        user = await this.authRepository.findOneByPhone(loginAuthDto.phone);
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

    await this.jwtRepository
      .upsert({ userId: user.id, token: hashToken })
      .catch((error) => {
        this.logger.error(`create jwt: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    return { data: { accessToken, refreshToken } };
  }

  async logout(userId: number): Promise<void> {
    await this.jwtRepository.remove(userId).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async refresh(user: JwtPayload): Promise<{
    data: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const { id, role, refreshToken } = user;
    const token = await this.jwtRepository.findOne(+id).catch((error) => {
      this.logger.error(error);
      throw new InternalServerErrorException('Server Error');
    });

    if (!token || !token.token) throw new UnauthorizedException('Unauthorized');
    const compare = await this.jwtTokenService
      .compare(refreshToken, token.token)
      .catch((error) => {
        throw new InternalServerErrorException('Server Error');
      });

    if (!compare) {
      throw new UnauthorizedException('Unauthorized');
    }

    const tokens: {
      accessToken: string;
      refreshToken: string;
    } = await this.jwtTokenService.getTokens(+id, role).catch((error) => {
      throw new InternalServerErrorException('Server Error');
    });

    const hashToken: string = await this.jwtTokenService.hashData(
      tokens.refreshToken,
    );

    await this.jwtRepository.upsert({
      userId: +id,
      token: hashToken,
    });
    return {
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }
}
