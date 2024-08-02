import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateCommand } from '../impl/create-user.command';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { User } from 'src/auth/entities/user.entity';

@CommandHandler(UserCreateCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<UserCreateCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}
  async execute(command: UserCreateCommand): Promise<User> {
    return await this.authRepository.create(command);
  }
}
