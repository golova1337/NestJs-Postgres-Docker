import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtRepository } from 'src/auth/repositories/Jwt.repository';
import { InsertJwtCommand } from '../impl/Create-jwt.command';

@CommandHandler(InsertJwtCommand)
export class InsertJwtCommandHandler
  implements ICommandHandler<InsertJwtCommand>
{
  constructor(private readonly jwtRepository: JwtRepository) {}

  async execute(query: InsertJwtCommand): Promise<void> {
    const { id, token } = query;

    await this.jwtRepository.upsert({ userId: id, token });

    return;
  }
}
