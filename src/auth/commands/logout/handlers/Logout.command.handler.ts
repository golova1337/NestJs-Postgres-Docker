import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from 'src/auth/commands/logout/impl/Logout.command';
import { JwtRepository } from 'src/auth/repository/Jwt.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  private readonly logger = new EmojiLogger();
  constructor(private readonly jwtRepository: JwtRepository) {}
  async execute(command: LogoutCommand): Promise<void> {
    const { id } = command;
    await this.jwtRepository.remove(id);
  }
}
