import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SingInCreateOtpCommand } from 'src/auth/commands/singIn/Sing-in-create-verification.command';
import { OtpRepository } from 'src/auth/repository/Otp.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { OtpService } from 'src/auth/services/otp.service';

@CommandHandler(SingInCreateOtpCommand)
export class SingInCreateOtpCommandHandler
  implements ICommandHandler<SingInCreateOtpCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OtpService,
  ) {}
  async execute(command: SingInCreateOtpCommand): Promise<string> {
    const { userId, registrationMethod, phone, email } = command;
    try {
      const otp: string = await this.otpService.generateCode();

      await this.otpRepository.upsert({
        otp,
        userId: userId,
      });

      return otp;
    } catch (error) {
      this.logger.error(`create otpRepository: ${error}`);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
