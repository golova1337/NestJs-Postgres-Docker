import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Otp } from 'src/auth/entities/otp.entity';
import { OtpRepository } from 'src/auth/repositories/otp.repository';
import { OtpService } from 'src/auth/services/otp.service';
import { ReceivingAndCheckingOtpQuery } from '../impl/receiving-and-checking.query';

@QueryHandler(ReceivingAndCheckingOtpQuery)
export class ReceivingAndCheckingOtpQueryHandler
  implements IQueryHandler<ReceivingAndCheckingOtpQuery>
{
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
