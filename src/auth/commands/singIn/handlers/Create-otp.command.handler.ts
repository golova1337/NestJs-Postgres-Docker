import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OtpRepository } from 'src/auth/repository/Otp.repository';
import { CreateOtpCommand } from '../impl/Create-otp.command';

@CommandHandler(CreateOtpCommand)
export class CreateOtpCommandHandler
  implements ICommandHandler<CreateOtpCommand>
{
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
