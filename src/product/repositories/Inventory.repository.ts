import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Inventory } from '../entities/inventory.entity';
import { Transaction } from 'sequelize';
import { Sign } from '../enum/sign-enum';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(Inventory)
    private readonly inventoryModel: typeof Inventory,
  ) {}

  async create(
    quantity: number,
    transaction?: Transaction,
  ): Promise<Inventory> {
    return this.inventoryModel.create({ quantity }, { transaction });
  }
}
