import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Otp } from '../entities/Otp.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectModel(Otp)
    private verificationCodesModel: typeof Otp,
  ) {}
  async upsert(data: { otp: string; userId: string }): Promise<[Otp, boolean]> {
    return this.verificationCodesModel.upsert({
      ...data,
      deletedAt: null,
    });
  }
  async findOne(otp: string): Promise<Otp | null> {
    return this.verificationCodesModel.findOne({
      where: { otp },
    });
  }

  async remove(code: string, transaction?: Transaction): Promise<number> {
    return this.verificationCodesModel.destroy({
      where: { otp: code },
      transaction,
    });
  }
}
