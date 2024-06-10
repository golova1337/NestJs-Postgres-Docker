import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtRepository {
  constructor(
    @InjectModel(User)
    private readonly user: typeof User,
  ) {}
  async update(
    userId: number,
    token: string,
  ): Promise<[affectedCount: number]> {
    return this.user.update({ token: token }, { where: { id: userId } });
  }
  async remove(userId: number) {
    return this.user.update(
      { token: null },
      {
        where: { id: userId },
      },
    );
  }

  async findOne(userId: number, token: string): Promise<User> {
    return this.user.findOne({ where: { id: userId, token: token } });
  }
}
