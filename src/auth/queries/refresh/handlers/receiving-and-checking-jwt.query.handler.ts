import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReceivingAndCheckingJwtQuery } from '../impl/receiving-and-checking-jwt.query';
import { JwtRepository } from '../../../repositories/jwt.repository';
import { JwtTokenService } from '../../../services/jwt.service';

@QueryHandler(ReceivingAndCheckingJwtQuery)
export class ReceivingAndCheckingJwtQueryHandler
  implements IQueryHandler<ReceivingAndCheckingJwtQuery>
{
  constructor(
    private readonly jwtRepository: JwtRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}
  async execute(query: ReceivingAndCheckingJwtQuery): Promise<boolean> {
    const { id, role, refreshToken } = query.user;
    const jwt = await this.jwtRepository.findOne(id);
    const compare = await this.jwtTokenService.compare(refreshToken, jwt.token);
    if (!compare || !jwt) throw new UnauthorizedException('Unauthorized');
    return true;
  }
}
