import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { VerificationRepository } from '../repository/verification-repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { AuthRepository } from '../repository/user-repository';

@Injectable()
export class VerifyService {
  private readonly logger = new EmojiLogger();
  constructor(
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
}
