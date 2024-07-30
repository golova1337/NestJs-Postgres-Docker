import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDiscountDto } from '../dto/create/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateDiscountCommand } from '../commands/create/impl/create-discount.command';
import { Discount } from '../entities/discount.entity';
import { FindAllDiscountsQuery } from '../queries/findAll/impl/find-all.query';
import { FindOneDiscountQuery } from '../queries/findOne/impl/find-one.query';
import { UpdateDiscountCommand } from '../commands/update/impl/update-discount.command';
import { DeleteDiscountCommand } from '../commands/delete/impl/delete-discount.command';

@Injectable()
export class DiscountService {
  logger = new EmojiLogger();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const { name, disc, discount_percent } = createDiscountDto;
    return this.commandBus
      .execute(new CreateDiscountCommand(name, disc, discount_percent))
      .catch((error) => {
        this.logger.error(`Create Discount ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findAll(name: string): Promise<Discount[]> {
    return this.queryBus
      .execute(new FindAllDiscountsQuery(name))
      .catch((error) => {
        this.logger.error(`Create Discount ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findOne(id: number): Promise<Discount | null> {
    return this.queryBus
      .execute(new FindOneDiscountQuery(id))
      .catch((error) => {
        this.logger.error(`Create Discount ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async update(
    id: number,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<void> {
    await this.commandBus
      .execute(new UpdateDiscountCommand(id, updateDiscountDto))
      .catch((error) => {
        this.logger.error(`Create Discount ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return;
  }

  async remove(ids: number[]): Promise<void> {
    await this.commandBus
      .execute(new DeleteDiscountCommand(ids))
      .catch((error) => {
        this.logger.error(`Create Discount ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return;
  }
}
