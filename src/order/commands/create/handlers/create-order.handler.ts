import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Cache } from 'cache-manager';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderStatus } from 'src/order/enum/order-status.enum';
import { OrderHelpers } from 'src/order/helpers/order.helper';
import { OrderItemRepository } from 'src/order/repositories/order-item.repository';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { CreateOrderCommand } from '../impl/create-order.impl';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderRepository: OrderRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
    private readonly orderHelpers: OrderHelpers,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  async execute(
    command: CreateOrderCommand,
  ): Promise<{ order: Order; orderItems: OrderItem[] }> {
    const { cacheCart, userId } = command;

    let cart = cacheCart.cart;
    let items = [];

    //start transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();

    try {
      const order = await this.orderRepository.create(
        {
          user_id: userId,
          status: OrderStatus.Created,
        },
        transaction,
      );

      for (const item of cart) {
        const product = await this.productRepository.findProductById(
          item.productId,
        );

        // decrease quantity and save
        await this.orderHelpers.decreaseQuantityAndSave(
          product,
          item,
          transaction,
        );

        const newItem = this.orderHelpers.createItem(order, product, item);

        items.push(newItem);
      }

      // save order items
      const orderItems = await this.orderItemRepository.bulkCreate(
        items,
        transaction,
      );

      //calculation total price for a order
      const total = await this.orderHelpers.calculateTotalPrice(items);
      // update order
      await order.update({ total_amount: total }, { transaction });
      //remove cash
      await this.cacheManager.del(`cart:${userId}`);
      //commit
      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      return { order, orderItems };
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);
    }
  }
}
