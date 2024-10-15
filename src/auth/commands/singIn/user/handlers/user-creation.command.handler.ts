import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { User } from '../../../../entities/user.entity';
import { AuthRepository } from '../../../../repositories/auth.repository';
import { UserCreationCommand } from '../impl/user-creation.command';

@CommandHandler(UserCreationCommand)
export class UserCreationCommandHandler
  implements ICommandHandler<UserCreationCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}
  async execute(command: UserCreationCommand): Promise<User> {
    const { singInAuthDto } = command;

    singInAuthDto.password = await bcrypt.hash(singInAuthDto.password, 10);
    const user = await this.authRepository.create(singInAuthDto);
    delete user.dataValues.password;
    return user;
  }
}
