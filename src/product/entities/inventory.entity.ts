import { Optional } from 'sequelize';
import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Product } from './product.entity';

export interface InventoryAttributes {
  id: string;
  quantity: number;
}

export interface InventoryCreationAttributes
  extends Optional<InventoryAttributes, 'id'> {}

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

  @HasOne(() => Product, 'inventory_id')
  product: Product;
}
