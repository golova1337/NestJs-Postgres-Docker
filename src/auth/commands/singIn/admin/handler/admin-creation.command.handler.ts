import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { User } from '../../../../entities/user.entity';
import { AuthRepository } from '../../../../repositories/auth.repository';
import { AdminCreationCommand } from '../impl/admin-creation.command';

@CommandHandler(AdminCreationCommand)
export class AdminCreationCommandHandler
  implements ICommandHandler<AdminCreationCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}
  async execute(command: AdminCreationCommand): Promise<User> {
    const { singInAuthDto } = command;

    singInAuthDto.password = await bcrypt.hash(singInAuthDto.password, 10);
    const user = await this.authRepository.create(singInAuthDto);
    delete user.dataValues.password;
    return user;
  }
}
