import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OtpRepository } from 'src/auth/repositories/otp.repository';
import { OtpCreationAndSavingCommand } from '../impl/otp-creation-and-saving.command';
import { OtpService } from 'src/auth/services/otp.service';
import { Otp } from 'src/auth/entities/otp.entity';

@CommandHandler(OtpCreationAndSavingCommand)
export class OtpCreationAndSavingCommandHandler
  implements ICommandHandler<OtpCreationAndSavingCommand>
{
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OtpService,
  ) {}
  async execute(command: OtpCreationAndSavingCommand): Promise<Otp> {
    const { userId } = command;
    const generateOtp: string = await this.otpService.generateOtp();
    return this.otpRepository.create({
      otp: generateOtp,
      userId: userId,
    });
  }
}
