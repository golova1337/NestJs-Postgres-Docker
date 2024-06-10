import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VerificationCodes } from '../entities/verify.entity';

@Injectable()
export class VerificationRepository {
  constructor(
    @InjectModel(VerificationCodes)
    private verificationCodesModel: typeof VerificationCodes,
  ) {}
  async create(data: {
    verificationCode: string;
    userId: string;
  }): Promise<VerificationCodes> {
    return this.verificationCodesModel.create(data);
  }
  async findOne(code: string): Promise<VerificationCodes | null> {
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
