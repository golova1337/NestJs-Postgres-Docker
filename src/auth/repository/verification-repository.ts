import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VerificationCode } from '../entities/verify.entity';

@Injectable()
export class VerificationRepository {
  constructor(
    @InjectModel(VerificationCode)
    private verificationCodesModel: typeof VerificationCode,
  ) {}
  async upsert(data: {
    verificationCode: string;
    userId: string;
  }): Promise<[VerificationCode, boolean]> {
    return this.verificationCodesModel.upsert({
      ...data,
      deletedAt: null,
    });
  }
  async findOne(code: string): Promise<VerificationCode | null> {
    return this.verificationCodesModel.findOne({
      where: { verificationCode: code },
    });
  }

  async remove(code: string): Promise<number> {
    return this.verificationCodesModel.destroy({
      where: { verificationCode: code },
    });
  }
}
