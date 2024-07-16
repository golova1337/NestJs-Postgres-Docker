import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { File } from '../entities/File.entity';

@Injectable()
export class UploadFileService {
  async deleteFiles(files: Array<Express.Multer.File> | File[]) {
    await Promise.all(
      files.map(async (file) => {
        const path = join(
          process.cwd(),
          process.env.LOCAL_STORAGE,
          file.filename,
        );
        await fs.unlink(path);
      }),
    );
  }
  async filterProperties(
    files: Array<Express.Multer.File>,
    product_id: string,
    author_id: string,
    metadata?: object,
  ) {
    const obj = await Promise.all(
      files.map((file) => {
        return {
          product_id: product_id,
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          author_id: author_id,
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
}
