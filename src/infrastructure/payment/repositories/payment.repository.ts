import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment, PaymentCreationAttributes } from '../entities/payment.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}
  async create(data: PaymentCreationAttributes, transaction?: Transaction) {
    return this.paymentModel.create(data, { transaction: transaction });
  }
}
