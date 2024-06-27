import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Otp } from '../entities/Otp.entity';

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
  async findOne(code: string): Promise<Otp | null> {
    return this.verificationCodesModel.findOne({
      where: { otp: code },
    });
  }

  async remove(code: string): Promise<number> {
    return this.verificationCodesModel.destroy({
      where: { otp: code },
    });
  }
}
