import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { CreateCategoryCommand } from '../commands/create/impl/Create-category.command';
import { CreateCategoryDto } from '../dto/create/create-category.dto';
import { Category } from '../entities/Product-category.entity';
import { FindAllCategoriesQuery } from '../queries/findAll/impl/Find-all-categories.command';
import { FindOneCategoryQueryCommand } from '../queries/findOne/impl/Find-one-category.command';
import { UpdateCategoryCommand } from '../commands/update/impl/Update-category.command';
import { RemoveCategoriesCommand } from '../commands/remove/impl/Remove-categories.command';
import { UpdateCategoryDto } from '../dto/update/update-category.dto';

@Injectable()
export class CategoryService {
  logger = new EmojiLogger();
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, desc } = createCategoryDto;
    return this.commandBus
      .execute(new CreateCategoryCommand(name, desc))
      .catch((error) => {
        this.logger.error(`Create category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findAll(): Promise<Category[]> {
    return this.queryBus
      .execute(new FindAllCategoriesQuery())
      .catch((error) => {
        this.logger.error(`Find All ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  findOne(id: number): Promise<Category | null> {
    return this.queryBus
      .execute(new FindOneCategoryQueryCommand(id))
      .catch((error) => {
        this.logger.error(`Find one category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<number> {
    return this.commandBus
      .execute(new UpdateCategoryCommand(id, updateCategoryDto))
      .catch((error) => {
        this.logger.error(`update category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async remove(ids: string[]): Promise<number> {
    return this.commandBus
      .execute(new RemoveCategoriesCommand(ids))
      .catch((error) => {
        this.logger.error(`remove category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }
}
