import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { AddItemCommand } from '../commands/addItem/impl/add-item.command';
import { RemoveItemCommand } from '../commands/removeItem/impl/remove-item.command';
import { UpdateItemCommand } from '../commands/updateItem/impl/update-item.command';
import { CreateCartItemDto } from '../dto/create-shopping_cart.dto';
import { UpdateItemDto } from '../dto/update-shopping_cart.dto';
import { SummaryQuery } from '../queries/summary/impl/summary.query';

@Injectable()
export class CartService {
  logger = new EmojiLogger();
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async addItem(createCartItemDto: CreateCartItemDto, userId: number) {
    return this.commandBus
      .execute(new AddItemCommand(createCartItemDto, userId))
      .catch((error) => {
        this.logger.error(`Add item in cart ${error}`);
        throw new BadRequestException(error);
      });
  }

  async summary(userId: number): Promise<{
    cart: any[];
    total: number;
  }> {
    return this.queryBus.execute(new SummaryQuery(userId)).catch((error) => {
      this.logger.error(`Summary cart ${error}`);
      throw new InternalServerErrorException('ServerError');
    });
  }

  async updateItem(
    userId: number,
    updateCartItemDto: UpdateItemDto,
  ): Promise<{
    cart: any[];
    total: number;
  }> {
    return this.commandBus
      .execute(new UpdateItemCommand(userId, updateCartItemDto))
      .catch((error) => {
        this.logger.error(`Update item cart ${error}`);
        throw new InternalServerErrorException('ServerError');
      });
  }

  async removeItem(
    itemId: number,
    userId: number,
  ): Promise<{
    cart: any[];
    total: number;
  }> {
    return this.commandBus
      .execute(new RemoveItemCommand(itemId, userId))
      .catch((error) => {
        this.logger.error(`Remove item ${error}`);
        throw new InternalServerErrorException('ServerError');
      });
  }
}
