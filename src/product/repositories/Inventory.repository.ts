import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductInventory } from '../entities/Product-inventory.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class ProductInventoryRepository {
  constructor(
    @InjectModel(ProductInventory)
    private readonly productInventoryModel: typeof ProductInventory,
  ) {}

  async create(
    quantity: string,
    transaction?: Transaction,
  ): Promise<ProductInventory> {
    return this.productInventoryModel.create({ quantity }, { transaction });
  }
}
