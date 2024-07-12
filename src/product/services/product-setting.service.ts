import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { RemoveProductImagesCommand } from '../commands/removeProductImages/impl/remove-product-images.command';
import { UpdateCategoryCommand } from '../commands/updateCategory/impl/Update-category-product.command';
import { UploadFilesCommand } from '../commands/uploadFiles/impl/Upload-files.command';
import { File } from '../entities/File.entity';

@Injectable()
export class ProductSettingService {
  logger = new EmojiLogger();
  constructor(private readonly commandBus: CommandBus) {}

  async upload(
    files: Array<Express.Multer.File>,
    id: string,
    userId: string,
  ): Promise<File[]> {
    return this.commandBus
      .execute(new UploadFilesCommand(files, id, userId))
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Internal Server');
      });
  }

  async updateCategory(
    id: number,
    categoria: string,
  ): Promise<[affectedCount: number]> {
    return this.commandBus
      .execute(new UpdateCategoryCommand(id, categoria))
      .catch((error) => {
        this.logger.error(`Update Category Product Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }

  async removeImages(ids: string[]): Promise<number> {
    return this.commandBus
      .execute(new RemoveProductImagesCommand(ids))
      .catch((error) => {
        this.logger.error(`Update Category Product Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }
}
