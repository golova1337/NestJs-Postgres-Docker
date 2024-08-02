import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Order, OrderCreationAttributes } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
  ) {}

  async create(
    order: OrderCreationAttributes,
    transaction?: Transaction,
  ): Promise<Order> {
    return this.orderModel.create(order, { transaction: transaction });
  }

  async findAll(userId: number): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { user_id: userId },
      include: [OrderItem],
    });
  }

  async findOne(id: number): Promise<Order | null> {
    return this.orderModel.findByPk(id, { include: [OrderItem] });
  }

  async remove(id: number): Promise<number> {
    return this.orderModel.destroy({ where: { id: id } });
  }
}
