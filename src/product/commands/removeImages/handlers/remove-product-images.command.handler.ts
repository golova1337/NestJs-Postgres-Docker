import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProductImagesCommand } from '../impl/remove-product-images.command';
import { FileService } from 'src/product/services/files.service';
import { FileRepository } from 'src/product/repositories/file.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { SequelizeTransactionRunner } from 'src/infrastructure/database/transaction/sequelize-transaction-runner.service';

@CommandHandler(RemoveProductImagesCommand)
export class RemoveProductFilesCommandHandler
  implements ICommandHandler<RemoveProductImagesCommand>
{
  constructor(
    private readonly fileService: FileService,
    private readonly fileRepository: FileRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}
  async execute(command: RemoveProductImagesCommand): Promise<void> {
    const { ids } = command;
    // start transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      // find Product files by ids  in DB
      const files = await this.fileRepository.findFilesByIds(ids, transaction);

      //deleted from DB
      await this.fileRepository.remove(ids, transaction);
      await this.fileService.deleteFiles(files);

      //commit
      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      return;
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);
      throw new InternalServerErrorException(error);
    }
  }
}
