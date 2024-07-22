import { Optional } from 'sequelize';
import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Product } from './product.entity';

export interface InventoryAttributes {
  id: string;
  quantity: number;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}

export interface InventoryCreationAttributes
  extends Optional<
    InventoryAttributes,
    'id' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  timestamps: true,
  tableName: 'inventory',
  paranoid: true,
  schema: 'store',
})
export class Inventory extends Model<
  InventoryAttributes,
  InventoryCreationAttributes
> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @HasOne(() => Product, 'inventory_id')
  product: Product;
}
