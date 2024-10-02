import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SequelizeTransactionRunner } from 'src/infrastructure/database/transaction/sequelize-transaction-runner.service';
import { Sign } from 'src/product/enum/sign-enum';
import { FileRepository } from 'src/product/repositories/file.repository';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { FileService } from 'src/product/services/files.service';
import { UpdateProductCommand } from '../impl/update-product.command';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly fileRepository: FileRepository,
    private readonly fileService: FileService,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}
  async execute(command: UpdateProductCommand): Promise<any> {
    //desturcturing
    const { id, files, updateProductDto } = command;
    const { changeQuantity, sign, ...updateProduct } = updateProductDto;
    //start transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      //get product by id

      let product = await this.productRepository.findProductById(id);

      //check  product exists
      if (!product) throw new BadRequestException('Bad Request');

      //update product
      await this.productRepository.updateProduct(
        updateProduct,
        id,
        transaction,
      );

      //update inventory
      if (changeQuantity && sign && changeQuantity > 0) {
        await this.updateQuantity(sign, changeQuantity, product, transaction);
      }

      // save the photos, if they  exist
      if (files.length > 0) {
        const data = await this.fileService.filterProperties(files, id);
        await this.fileRepository.create(data, transaction);
      }

      //commit tansaction
      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      return;
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);
      await this.fileService.deleteFiles(files);
    }
  }

  async updateQuantity(sign, changeQuantity, product, transaction) {
    switch (sign) {
      case Sign.Minus:
        await product.inventory.decrement({ quantity: changeQuantity });
        return product.save({ transaction });

      case Sign.Plus:
        await product.inventory.increment({ quantity: changeQuantity });
        return product.save({ transaction });

      default:
        break;
    }
  }
}
