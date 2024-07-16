import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { Category } from './entities/Product-category.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryRepository } from './repositories/Category.repository';
import { CreateCategoryCommandHandler } from './commands/create/handlers/Create-category.command.handler';
import { FindAllCategoriesQueryHandler } from './queries/findAll/handler/Find-all-categories.command.handler';
import { FindOneCategoryQueryHandler } from './queries/findOne/handler/Find-one-category.command.handler';
import { UpdateCategoryCommandHandler } from './commands/update/handler/Update-category.command.handler';
import { RemoveCategoriesCommandHandler } from './commands/remove/handler/Remove-categories.command.handler';

export const Services = [CategoryService];
export const Repository = [CategoryRepository];
export const CommandHandlers = [
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
  RemoveCategoriesCommandHandler,
];
export const QueryHandlers = [
  FindAllCategoriesQueryHandler,
  FindOneCategoryQueryHandler,
];

export const CategoryEntities = [Category];
@Module({
  imports: [SequelizeModule.forFeature(CategoryEntities), CqrsModule],
  controllers: [CategoryController],
  providers: [...Services, ...Repository, ...QueryHandlers, ...CommandHandlers],
})
export class CategoryModule {}
