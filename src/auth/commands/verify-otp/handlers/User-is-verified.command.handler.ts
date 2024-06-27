import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IsVerifiedCommand } from 'src/auth/commands/verify-otp/IsVerified.command';
import { AuthRepository } from 'src/auth/repository/Auth.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@CommandHandler(IsVerifiedCommand)
export class IsVerifiedCommandHandler
  implements ICommandHandler<IsVerifiedCommand>
{
  private readonly logger = new EmojiLogger();

  constructor(private readonly authRepository: AuthRepository) {}
  async execute(command: IsVerifiedCommand): Promise<void> {
    const { id } = command;
    await this.authRepository.isVerified(+id).catch((err) => {
      this.logger.error(`verificationCodes:${err}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }
}
