import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { OrderModule } from 'src/order/order.module';
import { Payment } from './entities/payment.entity';
import { PaymentCanceledEventHandler } from './events/canceled/handler/payment-canceled-handler.event';
import { PaymentCreatedEventHandler } from './events/created/handler/payment-created.event.handler';
import { PaymentFailedEventHandler } from './events/failed/handler/payment-failed-handler.event';
import { PaymentSucceededEventHandler } from './events/succeeded/handler/payment-succeeded-handler.event';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './repositories/payment.repository';

export const Entities = [Payment];

export const Events = [
  PaymentCreatedEventHandler,
  PaymentSucceededEventHandler,
  PaymentCanceledEventHandler,
  PaymentFailedEventHandler,
];

export const Transaction = [SequelizeTransactionRunner];

export const Repository = [PaymentRepository];

export const Services = [PaymentService];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities]), OrderModule],
  controllers: [PaymentController],
  providers: [...Services, ...Repository, ...Events, ...Transaction],
})
export class PaymentModule {}
