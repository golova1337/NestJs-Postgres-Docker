import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../entities/File.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class FileRepository {
  constructor(
    @InjectModel(File)
    private readonly fileModel: typeof File,
  ) {}
  async create(files, transaction: Transaction): Promise<File[]> {
    return this.fileModel.bulkCreate(files, { transaction });
  }
}
