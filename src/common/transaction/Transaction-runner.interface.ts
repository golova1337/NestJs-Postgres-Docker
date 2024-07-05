import { Transaction } from 'sequelize';

export interface TransactionRunner {
  startTransaction(): Promise<Transaction>;
  commitTransaction(transaction: Transaction): Promise<void>;
  rollbackTransaction(transaction: Transaction): Promise<void>;
}
