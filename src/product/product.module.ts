import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { Discount } from 'src/discount/entities/discount.entity';
import { DiscountRepository } from 'src/discount/repositories/discount.repository';
import { Review } from 'src/reviews/entities/review.entity';
import { ReviewRepository } from 'src/reviews/repositories/review.repository';
import { SearchModule } from 'src/search/search.module';
import { CreateProductCommandHandler } from './commands/products/create/handlers/create-product.command.handler';
import { RemoveProductFilesCommandHandler } from './commands/products/removeImages/handlers/remove-product-images.command.handler';
import { UpdateProductCommandHandler } from './commands/products/update/handlers/update-product.command.handler';
import { ProductIndexingConsumer } from './consumers/product-indexing.consumer';
import { ProductController } from './controllers/product.controller';
import { DiscountExistsConstraint } from './decorators/constraint/discount-exists';
import { ProductExistsConstraint } from './decorators/constraint/product-exists';
import { Category } from './entities/category.entity';
import { File } from './entities/file.entity';
import { Inventory } from './entities/inventory.entity';
import { Product } from './entities/product.entity';
import { FindAllProductsQueryHandler } from './query/product/findAll/handlers/find-all.command.handlers';
import { FindOneProductQueryHandler } from './query/product/findOne/handlers/find-one-product.query.handler';
import { CategoryRepository } from './repositories/category.repository';
import { FileRepository } from './repositories/file.repository';
import { InventoryRepository } from './repositories/inventory.repository';
import { ProductRepository } from './repositories/product.repository';
import { FileService } from './services/files.service';
import { ProductService } from './services/product.service';
import { CqrsModule } from '@nestjs/cqrs';

export const Entities = [Product, Inventory, File, Discount, Category, Review];

export const Services = [ProductService, FileService];

export const Transaction = [SequelizeTransactionRunner];

export const Repository = [
  ProductRepository,
  FileRepository,
  InventoryRepository,
  CategoryRepository,
  DiscountRepository,
  ReviewRepository,
];

export const ProductCommandHandlers = [
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  RemoveProductFilesCommandHandler,
];

export const ProductQueryHandlers = [
  FindAllProductsQueryHandler,
  FindOneProductQueryHandler,
];

export const Constraints = [ProductExistsConstraint, DiscountExistsConstraint];

export const ProductControllers = [ProductController];

export const Consumers = [ProductIndexingConsumer];

@Module({
  imports: [
    CqrsModule,
    SearchModule,
    SequelizeModule.forFeature([...Entities]),
    BullModule.registerQueue({
      name: 'elastic',
      defaultJobOptions: { removeOnComplete: true },
      streams: { events: { maxLen: 5000 } },
    }),
  ],
  controllers: [...ProductControllers],
  providers: [
    ...Services,
    ...Transaction,
    ...Repository,
    ...ProductCommandHandlers,
    ...Constraints,
    ...ProductQueryHandlers,
    ...Consumers,
  ],
})
export class ProductModule {}
