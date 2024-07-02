import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyUserCommand } from 'src/auth/commands/verify-otp/impl/User-is-verified.command.command';
import { AuthRepository } from 'src/auth/repository/Auth.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@CommandHandler(VerifyUserCommand)
export class VerifyUserCommandHandler
  implements ICommandHandler<VerifyUserCommand>
{
  private readonly logger = new EmojiLogger();

  constructor(private readonly authRepository: AuthRepository) {}
  async execute(command: VerifyUserCommand): Promise<void> {
    const { id } = command;
    await this.authRepository.isVerified(+id).catch((err) => {
      this.logger.error(`verificationCodes:${err}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }
}
