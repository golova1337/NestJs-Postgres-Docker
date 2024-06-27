import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginCreateJwtQuery } from 'src/auth/queries/login/Login-create-jwt.query';
import { JwtRepository } from 'src/auth/repository/Jwt.repository';
import { JwtTokenService } from 'src/auth/services/jwt.service';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@QueryHandler(LoginCreateJwtQuery)
export class LoginCreateJwtQueryHandler
  implements IQueryHandler<LoginCreateJwtQuery>
{
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly jwtRepository: JwtRepository,
  ) {}

  async execute(query: LoginCreateJwtQuery): Promise<{
    data: { accessToken: string; refreshToken: string };
  }> {
    const { id, role } = query;
    try {
      const { accessToken, refreshToken } =
        await this.jwtTokenService.getTokens(id, role);

      const hashToken = await this.jwtTokenService.hashData(refreshToken);

      await this.jwtRepository.upsert({ userId: id, token: hashToken });

      return { data: { accessToken, refreshToken } };
    } catch (error) {
      this.logger.error(`getTokens : ${error}`);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
