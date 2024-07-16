import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Otp } from 'src/auth/entities/Otp.entity';
import { OtpRepository } from 'src/auth/repositories/Otp.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { CheckOtpQuery } from '../impl/Check-verification-code.query';

@QueryHandler(CheckOtpQuery)
export class CheckOtpQueryHandler implements IQueryHandler<CheckOtpQuery> {
  private readonly logger = new EmojiLogger();

  constructor(private readonly otpRepository: OtpRepository) {}
  async execute(command: CheckOtpQuery): Promise<Otp | null> {
    const { otp } = command;
    return this.otpRepository.findOne(otp);
  }
}
