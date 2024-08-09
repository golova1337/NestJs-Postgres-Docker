import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderStatus } from 'src/order/enum/order-status.enum';
import { OrderItemRepository } from 'src/order/repositories/order-item.repository';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { CreateOrderCommand } from '../create-order.impl';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderRepository: OrderRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}
  async execute(
    command: CreateOrderCommand,
  ): Promise<{ order: Order; orderItems: OrderItem[] }> {
    const { cacheCart, userId } = command;

    let cart = cacheCart.cart;

    //start transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();

    try {
      //get all product id from a cart
      const ids = cart.map((item) => item.productId);
      //get products by id from DB
      const products = await this.productRepository.findManyProductsByIds(
        ids,
        transaction,
      );
      //create a Map colection for quick recieving
      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      let items = [];

      //check product
      for (const item of cart) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }
        if (item.quantity > product.inventory.quantity) {
          throw new BadRequestException(
            `Insufficient quantity for Product with ID ${item.productId}`,
          );
        }

        // decrease quantity and save
        await this.decreaseQuantityAndSave(product, item, transaction);

        //creating an order item that we are going to save in the database
        items.push(this.creationItem(product, item));
      }
      //calculation total price for a order
      const total = items.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.unit_price * currentValue.quantity,
        0,
      );
      // save order
      const order = await this.orderRepository.create(
        {
          user_id: userId,
          status: OrderStatus.Created,
          total_amount: total,
        },
        transaction,
      );
      //adding order_id each order item
      for (const item of items) {
        item.order_id = order.id;
      }
      // save order items
      const orderItems = await this.orderItemRepository.bulkCreate(
        items,
        transaction,
      );
      //commit
      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      return { order, orderItems };
    } catch (error) {
      console.log(error);

      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);
    }
  }
  private priceWithDiscount(product) {
    const discountFactor = (100 - product.discount['discount_percent']) / 100;
    const priceWithDiscount = product.price * discountFactor;
    return parseFloat(priceWithDiscount.toFixed(2));
  }

  private async decreaseQuantityAndSave(product, item, transaction) {
    product.inventory.quantity -= item.quantity;
    return product.inventory.save({ transaction });
  }

  private creationItem(product, item) {
    return {
      product_id: product.id,
      quantity: item.quantity,
      unit_price: product.discount
        ? this.priceWithDiscount(product)
        : parseFloat(product.price),
    };
  }
}
