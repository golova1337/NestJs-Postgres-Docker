import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { Discount } from 'src/discount/entities/discount.entity';
import { CreateProductCommandHandler } from './commands/products/create/handlers/create-product.command.handler';
import { RemoveProductFilesCommandHandler } from './commands/products/removeImages/handlers/remove-product-images.command.handler';
import { UpdateProductCommandHandler } from './commands/products/update/handlers/update-product.command.handler';
import { ProductController } from './controllers/product.controller';
import { ProductExistsConstraint } from './decorators/constraint/product-exists';
import { Category } from './entities/category.entity';
import { File } from './entities/file.entity';
import { Inventory } from './entities/inventory.entity';
import { Product } from './entities/product.entity';
import { CategoryRepository } from './repositories/category.repository';
import { FileRepository } from './repositories/file.repository';
import { InventoryRepository } from './repositories/inventory.repository';
import { ProductRepository } from './repositories/product.repository';
import { FileService } from './services/files.service';
import { ProductService } from './services/product.service';
import { DiscountExistsConstraint } from './decorators/constraint/discount-exists';
import { DiscountRepository } from 'src/discount/repositories/discount.repository';
import { FindAllCommandHandler } from './query/product/findAll/handlers/find-all.command.handlers';
import { ReviewRepository } from 'src/reviews/repositories/review.repository';
import { Review } from 'src/reviews/entities/review.entity';
import { ProductIndexingConsumer } from './consumers/product-indexing.consumer';
import { BullModule } from '@nestjs/bullmq';
import { FindOneProductQueryHandler } from './query/product/findOne/handlers/find-one-product.query.handler';

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
  FindAllCommandHandler,
  FindOneProductQueryHandler,
];

export const Constraints = [ProductExistsConstraint, DiscountExistsConstraint];

export const ProductControllers = [ProductController];

export const Consumers = [ProductIndexingConsumer];

@Module({
  imports: [
    CqrsModule,
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
