import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Otp } from '../entities/otp.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectModel(Otp)
    private otpModel: typeof Otp,
  ) {}

  async create(data: { otp: string; userId: number }): Promise<Otp> {
    return this.otpModel.create(data);
  }

  async findOne(otp: string): Promise<Otp | null> {
    return this.otpModel.findOne({
      where: { otp },
    });
  }

  async update(otp: string, userId: number): Promise<[affectedCount: number]> {
    return this.otpModel.update({ otp }, { where: { userId } });
  }

  async remove(code: string, transaction?: Transaction): Promise<number> {
    return this.otpModel.destroy({
      where: { otp: code },
      transaction,
    });
  }
}
