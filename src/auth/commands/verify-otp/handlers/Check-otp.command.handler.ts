import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckOtpCommand } from 'src/auth/commands/verify-otp/Check-verification-code.command';
import { Otp } from 'src/auth/entities/Otp.entity';
import { OtpRepository } from 'src/auth/repository/Otp.repository';
import { OtpService } from 'src/auth/services/otp.service';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@CommandHandler(CheckOtpCommand)
export class CheckOtpCommandHandler
  implements ICommandHandler<CheckOtpCommand>
{
  private readonly logger = new EmojiLogger();

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OtpService,
  ) {}
  async execute(command: CheckOtpCommand): Promise<any> {
    const { code } = command;
    try {
      const verificationCodes: Otp = await this.otpRepository.findOne(code);
      const validateOtp: boolean = await this.otpService.validateOtp(
        verificationCodes.otp,
        code,
      );

      const isOtpExpired: boolean = await this.otpService.isOtpExpired(
        verificationCodes.otpExpiresAt,
      );

      if (!validateOtp || !!isOtpExpired)
        throw new BadRequestException('Bad Request');

      return verificationCodes;
    } catch (error) {
      this.logger.error(`verificationCodes:${error}`);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Server Error');
    }
  }
  private async checkCode(
    verificationCode: string,
    code: string,
  ): Promise<boolean> {
    return verificationCode === code;
  }
}
