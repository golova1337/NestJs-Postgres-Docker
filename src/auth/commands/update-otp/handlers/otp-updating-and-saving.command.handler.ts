import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OtpRepository } from 'src/auth/repositories/otp.repository';
import { OtpService } from 'src/auth/services/otp.service';
import { OtpUpdatingAndSavingCommandr } from '../impl/otp-updating-and-saving.command';

@CommandHandler(OtpUpdatingAndSavingCommandr)
export class OtpUpdatingAndSavingCommandHandler
  implements ICommandHandler<OtpUpdatingAndSavingCommandr>
{
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly otpService: OtpService,
  ) {}
  async execute(command: OtpUpdatingAndSavingCommandr): Promise<string> {
    const { userId } = command;
    const generateOtp: string = await this.otpService.generateOtp();
    await this.otpRepository.update(generateOtp, userId);
    return generateOtp;
  }
}
