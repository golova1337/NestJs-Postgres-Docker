import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Inventory } from '../entities/inventory.entity';
import { Transaction } from 'sequelize';
import { Sign } from '../enum/sign-enum';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(Inventory)
    private readonly productInventoryModel: typeof Inventory,
  ) {}

  async create(
    quantity: number,
    transaction?: Transaction,
  ): Promise<Inventory> {
    return this.productInventoryModel.create({ quantity }, { transaction });
  }
  
  async update(
    changeQuantity: number,
    id: number,
    sign: Sign,
    transaction?: Transaction,
  ): Promise<[affectedRows: Inventory[], affectedCount?: number]> {
    switch (sign) {
      case '+':
        return this.productInventoryModel.increment('quantity', {
          where: { id },
          by: changeQuantity,
          transaction,
        });
      case '-':
        return this.productInventoryModel.decrement('quantity', {
          where: { id },
          by: changeQuantity,
          transaction,
        });

      default:
        break;
    }
  }
}
