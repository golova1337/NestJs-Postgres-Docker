import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OtpCreationAndSavingCommand } from '../impl/otp-creation-and-saving.command';
import { OtpRepository } from '../../../../repositories/otp.repository';
import { Otp } from '../../../../entities/otp.entity';
import { OtpService } from '../../../../services/otp.service';

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
