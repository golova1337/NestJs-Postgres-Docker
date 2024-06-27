import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entities/User.entity';
import { AuthRepository } from 'src/auth/repository/Auth.repository';
import { SingInCreateUserCommand } from 'src/auth/commands/singIn/Sing-in-create-user.command';

@CommandHandler(SingInCreateUserCommand)
export class SingInCreateUserCommandHandler
  implements ICommandHandler<SingInCreateUserCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: SingInCreateUserCommand): Promise<User> {
    try {
      command.password = await bcrypt.hash(command.password, 10);

      const user: User = await this.authRepository.create(command);

      delete user.dataValues.password;

      return user;
    } catch (error) {
      this.logger.error(`create user: ${error}`);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
