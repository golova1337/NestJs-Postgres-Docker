import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtRepository } from 'src/auth/repository/Jwt.repository';
import { JwtTokenService } from 'src/auth/services/Jwt.service';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { InsertJwtCommand } from '../impl/Create-jwt.command';

@CommandHandler(InsertJwtCommand)
export class InsertJwtCommandHandler
  implements ICommandHandler<InsertJwtCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly jwtRepository: JwtRepository,
  ) {}

  async execute(query: InsertJwtCommand): Promise<void> {
    const { id, token } = query;

    await this.jwtRepository.upsert({ userId: id, token });

    return;
  }
}
