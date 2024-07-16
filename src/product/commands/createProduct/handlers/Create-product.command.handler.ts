import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Product } from 'src/product/entities/Product.entity';
import { ProductInventory } from 'src/product/entities/Product-inventory.entity';
import { ProductRepository } from 'src/product/repositories/Product.repository';
import { CreateProductCommand } from '../impl/Create-product.command';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { ProductInventoryRepository } from 'src/product/repositories/Inventory.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { UploadFileService } from 'src/product/services/upload-files.service';
import { FileRepository } from 'src/product/repositories/File.repository';
import { File } from 'src/product/entities/File.entity';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly uploadFileService: UploadFileService,
    private readonly productInventoryRepository: ProductInventoryRepository,
    private readonly fileRepository: FileRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}

  async execute(command: CreateProductCommand): Promise<{
    product: Product;
    inventory: ProductInventory;
    images: File[];
  }> {
    const { files, author_id, quantity, ...product } = command;
    //start transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      //create inventory
      const inventory = await this.productInventoryRepository.create(
        quantity,
        transaction,
      );

      //create product
      const newProduct = await this.productRepository.create(
        product,
        inventory.id,
        transaction,
      );

      //filtratin date for File entity
      const data = await this.uploadFileService.filterProperties(
        files,
        newProduct.id,
        author_id,
      );

      //save product files in DB
      const newFiles: File[] = await this.fileRepository.create(
        data,
        transaction,
      );

      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      return { inventory, product: newProduct, images: newFiles };
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);

      await this.uploadFileService.deleteFiles(files);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
