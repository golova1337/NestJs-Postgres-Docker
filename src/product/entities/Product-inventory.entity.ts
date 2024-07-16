import { Optional } from 'sequelize';
import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Product } from './Product.entity';

export interface ProductInventoryAttributes {
  id: string;
  quantity: string;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}

export interface ProductInventoryCreationAttributes
  extends Optional<
    ProductInventoryAttributes,
    'id' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  timestamps: true,
  tableName: 'product_inventory',
  paranoid: true,
  schema: 'store',
})
export class ProductInventory extends Model<
  ProductInventoryAttributes,
  ProductInventoryCreationAttributes
> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: string;
  @Column({ type: DataType.DATE, allowNull: false })
  createdAt?: Date;
  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt?: Date;
  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @HasOne(() => Product, 'inventory_id')
  product: Product;
}
