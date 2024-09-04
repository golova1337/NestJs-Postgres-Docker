import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Otp } from 'src/auth/entities/otp.entity';
import { OtpRepository } from 'src/auth/repositories/otp.repository';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { ReceivingAndCheckingOtpQuery } from '../impl/receiving-and-checking.query';
import { OtpService } from 'src/auth/services/otp.service';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(ReceivingAndCheckingOtpQuery)
export class ReceivingAndCheckingOtpQueryHandler
  implements IQueryHandler<ReceivingAndCheckingOtpQuery>
{
  private readonly logger = new EmojiLogger();

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OtpService,
  ) {}
  async execute(command: ReceivingAndCheckingOtpQuery): Promise<Otp | null> {
    const { otp } = command;
    const recievedOtp = await this.otpRepository.findOne(otp);

    //vidate otp
    const validateOtp: boolean = await this.otpService.validateOtp(
      recievedOtp.otp,
      otp,
    );
    const isOtpExpired: boolean = await this.otpService.isOtpExpired(
      recievedOtp.otpExpiresAt,
    );
    if (!validateOtp || !!isOtpExpired)
      throw new BadRequestException('Bad Request');

    return recievedOtp;
  }
}
