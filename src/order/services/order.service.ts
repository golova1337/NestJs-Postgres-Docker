import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CashManagerService } from 'src/infrastructure/cash-manager/cash-manager.service';
import { CreateOrderCommand } from '../commands/create/impl/create-order.impl';
import { UpdateOrderCommand } from '../commands/update/update-order.impl';
import { UpdateStatusOrderDto } from '../dto/update-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { GetAndCheckOrderItemQuery } from '../queries/create/impl/get-and-check-order-item.query';
import { OrderRepository } from '../repositories/order.repository';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly logger: MyLogger,
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
