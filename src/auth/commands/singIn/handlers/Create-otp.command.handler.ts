import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOtpCommand } from '../impl/create-otp.command';
import { OtpRepository } from 'src/auth/repositories/otp.repository';

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
