import { Injectable } from '@nestjs/common';
import { TransactionRunner } from './transaction-runner.interface';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class SequelizeTransactionRunner implements TransactionRunner {
  constructor(private readonly sequelize: Sequelize) {}

  async startTransaction(): Promise<Transaction> {
    return this.sequelize.transaction();
  }

  async commitTransaction(transaction: Transaction): Promise<void> {
    await transaction.commit();
  }

  async rollbackTransaction(transaction: Transaction): Promise<void> {
    await transaction.rollback();
  }
}
