import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { ProductController } from './controllers/product.controller';
import { ProductCategory } from './entities/Product-category.entity';
import { ProductDiscount } from './entities/Product-discount.entity';
import { Product } from './entities/Product.entity';
import { ProductInventory } from './entities/Product-inventory.entity';
import { ProductRepository } from './repository/Product.repository';
import { CreateProductCommandHandler } from './commands/createProduct/handlers/Create-product.command.handler';
import { ProductService } from './services/product.service';
import { FindAllProductsQueryHandler } from './queries/findAllProducts/handlers/Find-all-products.query.handler';
import { FindOneProductQueryHAndler } from './queries/findOneProduct/handler/Find-one-product.query.handler';
import { UpdateProductCommandHandler } from './commands/updateProduct/handler/Update-product.command.handler';
import { RemoveProductsCommandHandler } from './commands/removeProducts/handlers/Remove-products.command.handler';
import { UpdateCategoryProductCommandHandler } from './commands/updateCategory/handlers/Update-category-product.command.handler';

export const ProductsEntity = [
  Product,
  ProductInventory,
  ProductCategory,
  ProductDiscount,
];
export const Services = [ProductService];
export const Transaction = [SequelizeTransactionRunner];
export const Repository = [ProductRepository];
export const CommandHandlers = [
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  RemoveProductsCommandHandler,
  UpdateCategoryProductCommandHandler,
];
export const QueryHandlers = [
  FindAllProductsQueryHandler,
  FindOneProductQueryHAndler,
];
@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...ProductsEntity])],
  controllers: [ProductController],
  providers: [
    ...Services,
    ...Transaction,
    ...Repository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class ProductModule {}
