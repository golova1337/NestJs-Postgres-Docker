import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/entities/user.entity';
import { UpdateEmailDto } from '../dto/update-email';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async finbByPk(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async removeAccount(id: number) {
    return this.userModel.destroy({ where: { id: id } });
  }
  async updateEmail(
    updateEmailDto: UpdateEmailDto,
    id: number,
  ): Promise<[affectedCount: number]> {
    return this.userModel.update(updateEmailDto, { where: { id } });
  }
}
