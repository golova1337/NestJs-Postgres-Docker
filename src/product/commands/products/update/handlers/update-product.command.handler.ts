import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { FileRepository } from 'src/product/repositories/file.repository';
import { InventoryRepository } from 'src/product/repositories/inventory.repository';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { FileService } from 'src/product/services/files.service';
import { UpdateProductCommand } from '../impl/update-product.command';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler
  implements ICommandHandler<UpdateProductCommand>
{
  logger = new EmojiLogger();

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly fileRepository: FileRepository,
    private readonly fileService: FileService,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}
  async execute(command: UpdateProductCommand): Promise<any> {
    //desturcturing
    const { id, quantity, files, sign, changeQuantity, ...rest } = command;
    //start transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      //get product by id

      const product = await this.productRepository.findProductById(id);

      //check  product exists
      if (!product) throw new BadRequestException('Bad Request');

      //update product
      await this.productRepository.updateProduct(rest, id, transaction);

      //update inventory
      if (changeQuantity && sign && changeQuantity > 0) {
        await this.inventoryRepository.update(
          changeQuantity,
          product.inventory_id,
          sign,
          transaction,
        );
      }

      // save the photos, if they  exist
      if (files.length > 0) {
        const data = await this.fileService.filterProperties(files, id);
        await this.fileRepository.create(data, transaction);
      }

      //commit tansaction
      await this.sequelizeTransactionRunner.commitTransaction(transaction);
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);
      await this.fileService.deleteFiles(files);
      throw new BadRequestException(error);
    }
  }
}
