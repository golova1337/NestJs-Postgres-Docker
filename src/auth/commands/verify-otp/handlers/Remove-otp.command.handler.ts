import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveOtpCommand } from 'src/auth/commands/verify-otp/Remove-verification-code.command';
import { OtpRepository } from 'src/auth/repository/Otp.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@CommandHandler(RemoveOtpCommand)
export class RemoveOtpCommandHandler
  implements ICommandHandler<RemoveOtpCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(private readonly otpRepository: OtpRepository) {}
  async execute(command: RemoveOtpCommand): Promise<void> {
    const { verificationCode } = command;
    await this.otpRepository.remove(verificationCode).catch((err) => {
      this.logger.error(`setNull:${err}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }
}
