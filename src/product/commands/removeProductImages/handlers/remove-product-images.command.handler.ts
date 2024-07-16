import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProductImagesCommand } from '../impl/remove-product-images.command';
import { UploadFileService } from 'src/product/services/upload-files.service';
import { FileRepository } from 'src/product/repositories/File.repository';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(RemoveProductImagesCommand)
export class RemoveProductFilesCommandHandler
  implements ICommandHandler<RemoveProductImagesCommand>
{
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly fileRepository: FileRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}
  async execute(command: RemoveProductImagesCommand): Promise<number> {
    const { ids } = command;
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      const files = await this.fileRepository.findAllByIds(ids, transaction);
      await this.uploadFileService.deleteFiles(files);

      return this.fileRepository.remove(ids, transaction);
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
