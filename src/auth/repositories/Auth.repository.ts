import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { SingInAuthUserDto } from '../dto/create/create-auth.dto';
import { User } from '../entities/user.entity';
import { RegistrationMethod } from '../enums/registMethod-enum';
import { Roles } from '../enums/roles-enum';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async create(
    data: SingInAuthUserDto | (SingInAuthUserDto & { role: Roles }),
  ): Promise<User> {
    return this.userModel.create(data);
  }

  async findOneByEmail(
    email: string,
    additionalOptions?: Partial<User | null>,
  ): Promise<User> {
    const whereOptions = { email, ...additionalOptions };
    return this.userModel.findOne({
      where: whereOptions,
    });
  }

  async findOneByPhone(
    phone: string,
    additionalOptions?: Partial<User>,
  ): Promise<User | null> {
    const whereOptions = { phone, ...additionalOptions };
    return this.userModel.findOne({ where: whereOptions });
  }

  async isVerified(
    userId: number,
    transaction?: Transaction,
  ): Promise<[affectedCount: number]> {
    return await this.userModel.update(
      { isVerified: true },
      { where: { id: userId }, transaction },
    );
  }

  async getUserByRegistrationMethod(
    registrationMethod: RegistrationMethod,
    email: string,
    phone: string,
  ): Promise<User | null> {
    switch (registrationMethod) {
      case 'phone':
        return await this.findOneByPhone(phone);
      case 'email':
        return await this.findOneByEmail(email);
      default:
        throw new BadRequestException('Invalid registration method');
    }
  }
}
