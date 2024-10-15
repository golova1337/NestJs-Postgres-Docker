import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { connection } from './connection';
import { SequelizeTransactionRunner } from './transaction/sequelize-transaction-runner.service';

@Global()
@Module({
  imports: [connection],
  controllers: [],
  providers: [SequelizeTransactionRunner],
  exports: [SequelizeModule, SequelizeTransactionRunner],
})
export class DatabaseModule {}
