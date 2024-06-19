import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { VerificationRepository } from '../repository/verification-repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { AuthRepository } from '../repository/auth-repository';
import { RepeatSendCode } from '../dto/repeat-code.dto';
import { User } from '../entities/user.entity';
import { SendCodeService } from './sendCode.service';
import { VerificationCode } from '../entities/verify.entity';
import { authenticator } from 'otplib';

@Injectable()
export class VerifyService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly sendCodeService: SendCodeService,
    private readonly verificationRepository: VerificationRepository,
    private readonly authRepository: AuthRepository,
  ) {}
  async generateCode(): Promise<string> {
    return authenticator.generate(process.env.SECRET_OTPLIB);
  }
  async checkCode(code: string): Promise<boolean> {
    console.log(process.env.SECRET_OTPLIB);
    return authenticator.verify({
      token: code,
      secret: process.env.SECRET_OTPLIB,
    });
  }
  async create(id: string): Promise<string> {
    const verificationCode: string = await this.generateCode();

    await this.verificationRepository
      .upsert({
        verificationCode,
        userId: id,
      })
      .catch((error) => {
        this.logger.error(`create verificationRepository: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return verificationCode;
  }

  async verify(query: { code: string }): Promise<VerificationCode> {
    const verificationCodes: VerificationCode =
      await this.verificationRepository.findOne(query.code).catch((err) => {
        this.logger.error(`verificationCodes:${err}`);
        throw new InternalServerErrorException('Server Error');
      });
    const check = await this.checkCode(verificationCodes.verificationCode);
    console.log(check);

    if (
      !verificationCodes ||
      verificationCodes.verificationCodeExpiresAt < new Date() ||
      !check
    )
      throw new BadRequestException('Bad Requestddd');

    return verificationCodes;
  }

  async repeatCode(body: RepeatSendCode): Promise<string> {
    let user: User;
    switch (body.registrationMethod) {
      case 'phone':
        user = await this.authRepository.findOneByPhone(body.phone);
        break;
      case 'email':
        user = await this.authRepository.findOneByEmail(body.email);
        break;

      default:
        throw new BadRequestException('Bad Request');
    }

    const verificationCode: string = await this.generateCode();
    await this.verificationRepository
      .upsert({
        verificationCode,
        userId: user.id,
      })
      .catch((error) => {
        this.logger.error(`create verificationRepository: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return verificationCode;
  }

  async remove(code: string) {
    await this.verificationRepository.remove(code).catch((err) => {
      this.logger.error(`setNull:${err}`);
      throw new InternalServerErrorException('Server Error');
    });
  }
}
