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
import { verifyCode } from 'src/utils/verify/verifyCode';
import { SendCodeService } from './sendCode.service';

@Injectable()
export class VerifyService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly sendCodeService: SendCodeService,
    private readonly verificationRepository: VerificationRepository,
    private readonly authRepository: AuthRepository,
  ) {}
  async verify(query: { code: string }): Promise<void> {
    const verificationCodes = await this.verificationRepository
      .findOne(query.code)
      .catch((err) => {
        this.logger.error(`verificationCodes:${err}`);
        throw new InternalServerErrorException('Server Error');
      });

    if (
      !verificationCodes ||
      verificationCodes.verificationCodeExpiresAt < new Date()
    )
      throw new BadRequestException('Bad Requestddd');

    await this.authRepository
      .isVerified(verificationCodes.userId)
      .catch((err) => {
        this.logger.error(`verificationCodes:${err}`);
        throw new InternalServerErrorException('Server Error');
      });

    await this.verificationRepository.remove(query.code).catch((err) => {
      this.logger.error(`setNull:${err}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }

  async repeatCode(body: RepeatSendCode): Promise<void> {
    let user: User;
    switch (body.registrationMethod) {
      case 'phone':
        user = await this.authRepository.findOneByPhone(body.numbers);
        break;
      case 'email':
        user = await this.authRepository.findOneByEmail(body.email);
        break;

      default:
        throw new BadRequestException('Bad Request');
    }

    const verificationCode = await verifyCode();
    await this.verificationRepository
      .upsert({
        verificationCode,
        userId: user.id,
      })
      .catch((error) => {
        this.logger.error(`create verificationRepository: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    await this.sendCodeService.send({ ...body, code: verificationCode });
    return;
  }
}
