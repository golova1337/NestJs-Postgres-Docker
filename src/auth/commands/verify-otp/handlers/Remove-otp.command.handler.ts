import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveOtpCommand } from 'src/auth/commands/verify-otp/impl/Remove-verification-code.command';
import { OtpRepository } from 'src/auth/repositories/Otp.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@CommandHandler(RemoveOtpCommand)
export class RemoveOtpCommandHandler
  implements ICommandHandler<RemoveOtpCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(private readonly otpRepository: OtpRepository) {}
  async execute(command: RemoveOtpCommand): Promise<void> {
    const { verificationCode } = command;
    await this.otpRepository.remove(verificationCode);
    return;
  }
}
