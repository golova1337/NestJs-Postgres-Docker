import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cache } from 'cache-manager';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { CreateOrderCommand } from '../commands/create/impl/create-order.impl';
import { UpdateOrderCommand } from '../commands/update/update-order.impl';
import { UpdateStatusOrderDto } from '../dto/update-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { GetAndCheckOrderItemQuery } from '../queries/create/impl/get-and-check-order-item.query';

@Injectable()
export class OrderService {
  logger = new EmojiLogger();
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly orderRepository: OrderRepository,
  ) {}
  async create(
    userId: number,
  ): Promise<{ order: Order; orderItems: OrderItem[] }> {
    try {
      // check cart
      const cacheCart = await this.queryBus.execute(
        new GetAndCheckOrderItemQuery(userId),
      );
      // order creation
      return this.commandBus.execute(new CreateOrderCommand(userId, cacheCart));
    } catch (error) {
      this.logger.error(`Order Creation: ${error.message}`);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Server Error');
      }
    }
  }

  findAll(userId: number): Promise<Order[]> {
    return this.orderRepository.findAll(userId).catch((error) => {
      this.logger.error(`Find all order ${error}`);
      throw new InternalServerErrorException('ServerError');
    });
  }

  findOne(id: number): Promise<Order | null> {
    return this.orderRepository.findOne(id).catch((error) => {
      this.logger.error(`Find one order ${error}`);
      throw new InternalServerErrorException('ServerError');
    });
  }

  async update(id: number, updateStatusOrderDto: UpdateStatusOrderDto) {
    return this.commandBus
      .execute(new UpdateOrderCommand(id, updateStatusOrderDto))
      .catch((error) => {
        this.logger.error(`Update order ${error}`);
        throw new InternalServerErrorException('ServerError');
      });
  }

  remove(id: number): Promise<number> {
    return this.orderRepository.remove(id).catch((error) => {
      this.logger.error(`Find all order ${error}`);
      throw new InternalServerErrorException('ServerError');
    });
  }
}
