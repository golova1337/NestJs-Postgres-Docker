import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  OrderItem,
  OrderItemCreationAttributes,
} from '../entities/order-item.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async create(
    item: OrderItemCreationAttributes,
    transaction?: Transaction,
  ): Promise<OrderItem> {
    return this.orderItemModel.create(item, { transaction: transaction });
  }

  async bulkCreate(
    items: OrderItemCreationAttributes[],
    transaction?: Transaction,
  ): Promise<OrderItem[]> {
    return this.orderItemModel.bulkCreate(items, {
      validate: true,
      transaction: transaction,
    });
  }
}
