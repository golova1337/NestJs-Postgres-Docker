import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { CreateProductCommandHandler } from './commands/createProduct/handlers/Create-product.command.handler';
import { RemoveProductsCommandHandler } from './commands/removeProducts/handlers/Remove-products.command.handler';
import { UpdateCategoryProductCommandHandler } from './commands/updateCategory/handlers/Update-category-product.command.handler';
import { UpdateProductCommandHandler } from './commands/updateProduct/handler/Update-product.command.handler';
import { UploadFilesCommandHandler } from './commands/uploadFiles/handlers/Upload-files.command.handlers';
import { ProductController } from './controllers/product.controller';
import { File } from './entities/File.entity';
import { ProductDiscount } from './entities/Product-discount.entity';
import { ProductInventory } from './entities/Product-inventory.entity';
import { Product } from './entities/Product.entity';
import { FindAllProductsQueryHandler } from './queries/findAllProducts/handlers/Find-all-products.query.handler';
import { FindOneProductQueryHAndler } from './queries/findOneProduct/handler/Find-one-product.query.handler';
import { FileRepository } from './repositories/File.repository';
import { ProductRepository } from './repositories/Product.repository';
import { ProductService } from './services/product.service';
import { UploadFileService } from './services/upload-files.service';

export const ProductsEntity = [
  Product,
  ProductInventory,
  ProductDiscount,
  File,
];
export const Services = [ProductService, UploadFileService];
export const Transaction = [SequelizeTransactionRunner];
export const Repository = [ProductRepository, FileRepository];
export const CommandHandlers = [
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  RemoveProductsCommandHandler,
  UpdateCategoryProductCommandHandler,
  UploadFilesCommandHandler,
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
