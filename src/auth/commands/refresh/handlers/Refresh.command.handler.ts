import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from 'src/auth/commands/refresh/Refresh.command';
import { Jwt } from 'src/auth/entities/jwt.entity';
import { JwtRepository } from 'src/auth/repository/Jwt.repository';
import { JwtTokenService } from 'src/auth/services/jwt.service';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler implements ICommandHandler<RefreshCommand> {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly jwtRepository: JwtRepository,
  ) {}
  async execute(command: RefreshCommand): Promise<{
    data: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const { id, role, refreshToken } = command;
    try {
      const token = await this.findToken(+id);
      await this.compareToken(refreshToken, token.token);
      const tokens = await this.createNewTokens(id, role);

      const hashToken: string = await this.jwtTokenService.hashData(
        tokens.refreshToken,
      );

      await this.jwtRepository.upsert({
        userId: id,
        token: hashToken,
      });
      return {
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.logger.warn(`Refresh ${error}`);
        throw error;
      }
      this.logger.error(`Refresh ${error}`);
      throw new InternalServerErrorException('Server Error');
    }
  }

  private async findToken(id: number): Promise<Jwt> {
    const token = await this.jwtRepository.findOne(+id);

    if (!token || !token.token) throw new UnauthorizedException('Unauthorized');
    return token;
  }

  private async compareToken(refreshToken, token): Promise<void> {
    const compare = await this.jwtTokenService.compare(refreshToken, token);

    if (!compare) throw new UnauthorizedException('Unauthorized');
    return;
  }
  private async createNewTokens(
    id: string,
    role: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const tokens: {
      accessToken: string;
      refreshToken: string;
    } = await this.jwtTokenService.getTokens(id, role);
    return tokens;
  }
}
