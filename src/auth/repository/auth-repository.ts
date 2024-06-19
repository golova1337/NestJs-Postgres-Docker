import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { SingInAuthDto } from '../dto/create-auth.dto';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async create(data: SingInAuthDto): Promise<User> {
    return this.userModel.create(data);
  }
  async findOneByEmail(
    email: string,
    additionalOptions?: Partial<User>,
  ): Promise<User> {
    const whereOptions = { email, ...additionalOptions };
    return this.userModel.findOne({
      where: whereOptions,
    });
  }
  async findOneByPhone(
    phone: string,
    additionalOptions?: Partial<User>,
  ): Promise<User> {
    const whereOptions = { phone, ...additionalOptions };
    return this.userModel.findOne({ where: whereOptions });
  }

  async isVerified(userId: number): Promise<[affectedCount: number]> {
    return await this.userModel.update(
      { isVerified: true },
      { where: { id: userId } },
    );
  }
}
