import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../impl/logout.command';
import { JwtRepository } from 'src/auth/repositories/jwt.repository';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly jwtRepository: JwtRepository) {}
  async execute(command: LogoutCommand): Promise<void> {
    const { id } = command;
    await this.jwtRepository.remove(id);
  }
}
