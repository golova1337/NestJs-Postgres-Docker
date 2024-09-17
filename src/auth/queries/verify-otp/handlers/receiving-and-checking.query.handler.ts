import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReceivingAndCheckingOtpQuery } from '../impl/receiving-and-checking.query';
import { BadRequestException } from '@nestjs/common';
import { EmojiLogger } from '../../../../common/logger/emojiLogger';
import { OtpRepository } from '../../../repositories/otp.repository';
import { OtpService } from '../../../services/otp.service';
import { Otp } from '../../../entities/otp.entity';

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
