import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtRepository } from 'src/auth/repositories/jwt.repository';
import { JwtTokenService } from 'src/auth/services/jwt.service';
import { ReceivingAndCheckingJwtQuery } from '../impl/receiving-and-checking-jwt.query';

@QueryHandler(ReceivingAndCheckingJwtQuery)
export class ReceivingAndCheckingJwtQueryHandler
  implements IQueryHandler<ReceivingAndCheckingJwtQuery>
{
  constructor(
    private readonly jwtRepository: JwtRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}
  async execute(query: ReceivingAndCheckingJwtQuery): Promise<void> {
    const { id, role, refreshToken } = query.user;
    const jwt = await this.jwtRepository.findOne(id);
    const compare = await this.jwtTokenService.compare(refreshToken, jwt.token);
    if (!compare || !jwt) throw new UnauthorizedException('Unauthorized');
    return;
  }
}
