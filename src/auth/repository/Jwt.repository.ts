import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Jwt } from '../entities/Jwt.entity';

@Injectable()
export class JwtRepository {
  constructor(
    @InjectModel(Jwt)
    private readonly jwt: typeof Jwt,
  ) {}
  async upsert(token: {
    userId: string;
    token: string;
  }): Promise<[Jwt, boolean]> {
    return this.jwt.upsert(token);
  }
  async remove(userId: number) {
    return this.jwt.update(
      { token: null },
      {
        where: { userId: userId },
      },
    );
  }

  async findOne(userId: number): Promise<Jwt | null> {
    return this.jwt.findOne({
      where: { userId: userId },
    });
  }
}
