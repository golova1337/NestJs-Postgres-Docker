import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { CreateProductCommandHandler } from './commands/products/create/handlers/create-product.command.handler';
import { RemoveProductFilesCommandHandler } from './commands/products/removeImages/handlers/remove-product-images.command.handler';
import { RemoveProductsCommandHandler } from './commands/products/removeProduct/handlers/remove-products.command.handler';
import { UpdateProductCommandHandler } from './commands/products/update/handlers/update-product.command.handler';
import { ProductController } from './controllers/product.controller';
import { ProductExistsConstraint } from './decorators/constraint/product-exists';
import { File } from './entities/file.entity';
import { Discount } from './entities/discount.entity';
import { Inventory } from './entities/inventory.entity';
import { Product } from './entities/product.entity';
import { FindAllProductsQueryHandler } from './queries/products/findAll/handlers/find-all-products.query.handler';
import { FindOneProductQueryHAndler } from './queries/products/findOne/handler/find-one-product.query.handler';
import { FileRepository } from './repositories/file.repository';
import { InventoryRepository } from './repositories/inventory.repository';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { FileService } from './services/files.service';
import { CreateCategoryCommandHandler } from './commands/categories/create/handlers/create-category.command.handler';
import { UpdateCategoryCommandHandler } from './commands/categories/update/handler/update-category.command.handler';
import { RemoveCategoriesCommandHandler } from './commands/categories/remove/handler/remove-categories.command.handler';
import { FindAllCategoriesQueryHandler } from './queries/categories/findAll/handler/find-all-categories.command.handler';
import { FindOneCategoryQueryHandler } from './queries/categories/findOne/handler/find-one-category.command.handler';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';

export const Entities = [Product, Inventory, File, Discount, Category];

export const Services = [ProductService, FileService];

export const Transaction = [SequelizeTransactionRunner];

export const Repository = [
  ProductRepository,
  FileRepository,
  InventoryRepository,
  CategoryRepository,
];

export const ProductCommandHandlers = [
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  RemoveProductsCommandHandler,
  RemoveProductFilesCommandHandler,
];

export const CategoryCommandHandlers = [
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
  RemoveCategoriesCommandHandler,
];

export const ProductQueryHandlers = [
  FindAllProductsQueryHandler,
  FindOneProductQueryHAndler,
];

export const CategoryQueryHandlers = [
  FindAllCategoriesQueryHandler,
  FindOneCategoryQueryHandler,
];

export const Constraints = [ProductExistsConstraint];

export const ProductControllers = [ProductController];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities])],
  controllers: [...ProductControllers],
  providers: [
    ...Services,
    ...Transaction,
    ...Repository,
    ...ProductCommandHandlers,
    ...ProductQueryHandlers,
    ...CategoryCommandHandlers,
    ...CategoryQueryHandlers,
    ...Constraints,
  ],
})
export class ProductModule {}
