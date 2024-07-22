import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Otp } from 'src/auth/entities/otp.entity';
import { OtpRepository } from 'src/auth/repositories/otp.repository';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { CheckOtpQuery } from '../impl/check-verification-code.query';

@QueryHandler(CheckOtpQuery)
export class CheckOtpQueryHandler implements IQueryHandler<CheckOtpQuery> {
  private readonly logger = new EmojiLogger();

  constructor(private readonly otpRepository: OtpRepository) {}
  async execute(command: CheckOtpQuery): Promise<Otp | null> {
    const { otp } = command;
    return this.otpRepository.findOne(otp);
  }
}
