import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/auth/entities/User.entity';
import { AuthRepository } from 'src/auth/repository/Auth.repository';
import { UserCreateCommand } from '../impl/Create-user.command';

@CommandHandler(UserCreateCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<UserCreateCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}
  async execute(command: UserCreateCommand): Promise<User> {
    return await this.authRepository.create(command);
  }
}
