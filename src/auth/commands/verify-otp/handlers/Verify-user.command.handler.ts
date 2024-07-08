import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyUserCommand } from 'src/auth/commands/verify-otp/impl/User-is-verified.command.command';
import { AuthRepository } from 'src/auth/repositories/Auth.repository';

@CommandHandler(VerifyUserCommand)
export class VerifyUserCommandHandler
  implements ICommandHandler<VerifyUserCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}
  async execute(command: VerifyUserCommand): Promise<void> {
    const { id } = command;
    await this.authRepository.isVerified(+id);
    return;
  }
}
