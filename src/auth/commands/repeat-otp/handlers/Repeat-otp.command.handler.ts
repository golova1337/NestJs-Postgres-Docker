import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepeatSendOtpCommand } from 'src/auth/commands/repeat-otp/Repeat-otp.command';
import { User } from 'src/auth/entities/User.entity';
import { AuthRepository } from 'src/auth/repository/Auth.repository';
import { OtpRepository } from 'src/auth/repository/Otp.repository';
import { OtpService } from 'src/auth/services/otp.service';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@CommandHandler(RepeatSendOtpCommand)
export class RepeatSendOtpCommandHandler
  implements ICommandHandler<RepeatSendOtpCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly otpService: OtpService,
    private readonly otpRepository: OtpRepository,
  ) {}
  async execute(command: RepeatSendOtpCommand): Promise<string> {
    const { registrationMethod, email, phone } = command;
    try {
      const user: User | null =
        await this.authRepository.getUserByRegistrationMethod(
          registrationMethod,
          email,
          phone,
        );
      if (!user) throw new BadRequestException('Bad Request');
      const otp: string = await this.otpService.generateCode();
      await this.otpRepository.upsert({ otp, userId: user.id });
      return otp;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Server Error');
    }
  }
}
