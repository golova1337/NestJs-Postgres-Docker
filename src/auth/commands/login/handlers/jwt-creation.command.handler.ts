import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtCreationCommand } from '../impl/jwt-cration.command';
import { JwtRepository } from 'src/auth/repositories/jwt.repository';
import { JwtTokenService } from 'src/auth/services/jwt.service';

@CommandHandler(JwtCreationCommand)
export class JwtCreationCommandHandler
  implements ICommandHandler<JwtCreationCommand>
{
  constructor(
    private readonly jwtRepository: JwtRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(query: JwtCreationCommand): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { id, role } = query;
    //create new jwt
    const tokens: {
      accessToken: string;
      refreshToken: string;
    } = await this.jwtTokenService.getTokens(id, role);

    const hashToken: string = await this.jwtTokenService.hashData(
      tokens.refreshToken,
    );
    await this.jwtRepository.upsert({ userId: id, token: hashToken });
    return tokens;
  }
}
