import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OtpRepository } from 'src/auth/repository/Otp.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { CreateOtpCommand } from '../impl/Create-otp.command';

@CommandHandler(CreateOtpCommand)
export class CreateOtpCommandHandler
  implements ICommandHandler<CreateOtpCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(private readonly otpRepository: OtpRepository) {}
  async execute(command: CreateOtpCommand): Promise<void> {
    const { userId, otp } = command;
    await this.otpRepository.upsert({
      otp,
      userId: userId,
    });
    return;
  }
}
