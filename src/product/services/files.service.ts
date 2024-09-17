import { HttpStatus, Injectable, ParseFilePipeBuilder } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { File } from '../entities/file.entity';
import { diskStorage } from 'multer';
import { Size } from '../enum/multer-enum';

@Injectable()
export class FileService {
  async deleteFiles(files: Array<Express.Multer.File> | File[]) {
    await Promise.all(
      files.map(async (file) => {
        const path = join(file.destination, file.filename);
        await fs.unlink(path);
      }),
    );
  }

  async filterProperties(
    files: Array<Express.Multer.File> | undefined,
    product_id: number,
    metadata?: object,
  ) {
    if (typeof files === 'undefined') return false;
    const obj = await Promise.all(
      files.map((file) => {
        return {
          product_id: product_id,
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          metadata: metadata || null,
        };
      }),
    );

    return obj;
  }

  static localStore(): string {
    return join(process.cwd(), 'src/product/localStore');
  }

  static fileNameEditor(req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    callback(null, `${file.fieldname}-${uniqueSuffix}`);
  }

  static imageFileFilter() {
    return /(jpg|jpeg|png|gif)$/;
  }

  static storeg() {
    return diskStorage({
      destination: this.localStore(),
      filename: this.fileNameEditor,
    });
  }

  static validate() {
    return new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: FileService.imageFileFilter(),
      })
      .addMaxSizeValidator({
        maxSize: Size.Product,
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
      });
  }
}
