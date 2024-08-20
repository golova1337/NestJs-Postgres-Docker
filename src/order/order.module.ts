import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { CreateOrderCommandHandler } from './commands/create/handlers/create-order.handler';
import { UpdateOrderCommandHandler } from './commands/update/handlers/update-order.handler';
import { OrderController } from './controllers/order.controller';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';
import { OrderHelpers } from './helpers/order.helper';
import { GetAndCheckOrderItemQueryHandler } from './queries/create/handler/get-and-check-order-item.query.handler';

export const Entities = [Order, OrderItem, Product];
export const Repositories = [
  ProductRepository,
  OrderItemRepository,
  OrderRepository,
];
export const Services = [OrderService];
export const Transaction = [SequelizeTransactionRunner];
export const Commands = [CreateOrderCommandHandler, UpdateOrderCommandHandler];
export const Queries = [GetAndCheckOrderItemQueryHandler];
export const Helpers = [OrderHelpers];
@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities])],
  controllers: [OrderController],
  providers: [
    ...Services,
    ...Repositories,
    ...Transaction,
    ...Commands,
    ...Helpers,
    ...Queries,
  ],
  exports: [OrderRepository],
})
export class OrderModule {}
