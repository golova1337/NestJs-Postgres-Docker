import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { File } from 'src/product/entities/File.entity';
import { FileRepository } from 'src/product/repositories/File.repository';
import { UploadFileService } from 'src/product/services/upload-files.service';
import { UploadFilesCommand } from '../impl/Upload-files.command';

@CommandHandler(UploadFilesCommand)
export class UploadFilesCommandHandler
  implements ICommandHandler<UploadFilesCommand>
{
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
    private readonly fileRepository: FileRepository,
  ) {}
  async execute(command: UploadFilesCommand): Promise<File[]> {
    const { files, author_id, product_id } = command;
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();

    try {
      // create objects for to save in DB
      const data = await this.uploadFileService.filterProperties(
        files,
        product_id,
        author_id,
      );

      // save to db
      const newFiles: File[] = await this.fileRepository.create(
        data,
        transaction,
      );
      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      return newFiles;
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);

      // If there are problems in the database, we will delete the images from local storage
      await this.uploadFileService.deleteFiles(files);

      throw new InternalServerErrorException('Internal Server');
    }
  }
}
