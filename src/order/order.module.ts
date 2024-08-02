import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderController } from './controllers/order.controller';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { Product } from 'src/product/entities/product.entity';
import { OrderItemRepository } from './repositories/order-item.repository';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { OrderRepository } from './repositories/order.repository';
import { CreateOrderCommandHandler } from './command/create/handlers/create-order.handler';
import { UpdateOrderCommandHandler } from './command/update/handlers/update-order.handler';

export const Entities = [Order, OrderItem, Product];
export const Repositories = [
  ProductRepository,
  OrderItemRepository,
  OrderRepository,
];
export const Services = [OrderService];
export const Transaction = [SequelizeTransactionRunner];
export const Commands = [CreateOrderCommandHandler, UpdateOrderCommandHandler];
@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities])],
  controllers: [OrderController],
  providers: [...Services, ...Repositories, ...Transaction, ...Commands],
})
export class OrderModule {}
