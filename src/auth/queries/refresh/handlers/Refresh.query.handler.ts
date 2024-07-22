import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RefreshQuery } from '../impl/refresh.query';
import { JwtRepository } from 'src/auth/repositories/jwt.repository';
import { Jwt } from 'src/auth/entities/jwt.entity';

@QueryHandler(RefreshQuery)
export class RefreshQueryHandler implements IQueryHandler<RefreshQuery> {
  constructor(private readonly jwtRepository: JwtRepository) {}
  async execute(query: RefreshQuery): Promise<Jwt | null> {
    const { userId } = query;
    return this.jwtRepository.findOne(+userId);
  }
}
