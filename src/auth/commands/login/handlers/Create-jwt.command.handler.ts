import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InsertJwtCommand } from '../impl/create-jwt.command';
import { JwtRepository } from 'src/auth/repositories/jwt.repository';

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
