import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { File } from 'src/product/entities/file.entity';
import { Inventory } from 'src/product/entities/inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { FileRepository } from 'src/product/repositories/file.repository';
import { InventoryRepository } from 'src/product/repositories/inventory.repository';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { FileService } from 'src/product/services/files.service';
import { CreateProductCommand } from '../impl/create-product.command';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly fileService: FileService,
    private readonly fileRepository: FileRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
    @InjectQueue('product-indexing') private productIndexingQueue: Queue,
  ) {}

  async execute(command: CreateProductCommand): Promise<{
    product: Product;
    inventory: Inventory;
    images: File[];
  }> {
    const { files, product } = command;

    const { quantity, ...rest } = product;
    //start transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      //create inventory
      const inventory = await this.inventoryRepository.create(
        quantity,
        transaction,
      );

      //create product
      const newProduct = await this.productRepository.createProduct(
        rest,
        inventory.id,
        transaction,
      );

      //filtratin date for File entity
      const data = await this.fileService.filterProperties(
        files,
        newProduct.id,
      );
      //save product files in DB
      const newFiles: File[] = await this.fileRepository.create(
        data,
        transaction,
      );

      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      console.log('skks');

      const job = await this.productIndexingQueue.add(
        'product-indexing-elastic',
        newProduct,
        {
          delay: 3000,
          attempts: 3,
        },
      );
      return { inventory, product: newProduct, images: newFiles };
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);

      await this.fileService.deleteFiles(files);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
