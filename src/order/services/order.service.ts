import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cache } from 'cache-manager';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { CreateOrderCommand } from '../command/create/create-order.impl';
import { UpdateOrderCommand } from '../command/update/update-order.impl';
import { UpdateStatusOrderDto } from '../dto/update-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrderService {
  logger = new EmojiLogger();
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly commandBus: CommandBus,
    private readonly orderRepository: OrderRepository,
  ) {}
  async create(
    userId: number,
  ): Promise<{ order: Order; orderItems: OrderItem[] }> {
    const cacheKey = `cart:${userId}`;
    // check cart

    const cacheCart = await this.cacheManager.get<{
      cart: any[];
      total: number;
    }>(cacheKey);
    let cart = cacheCart?.cart;
    if (!cart || cart.length === 0) return;

    return this.commandBus
      .execute(new CreateOrderCommand(userId, cacheCart))
      .catch((error) => {
        this.logger.error(`create order ${error}`);
        throw new InternalServerErrorException('ServerError');
      });
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
