import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from './product.entity';

export interface DiscountAttributes {
  id: string;
  name: string;
  disc: string;
  discount_percent: string;
  active: boolean;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}

export interface DiscountCreationAttributes
  extends Optional<
    DiscountAttributes,
    'id' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  timestamps: true,
  tableName: 'discounts',
  paranoid: true,
  schema: 'store',
})
export class Discount extends Model<
  DiscountAttributes,
  DiscountCreationAttributes
> {
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  disc: string;

  @Column({ type: DataType.DECIMAL(4, 2), allowNull: false })
  discount_percent: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @HasMany(() => Product, 'discount_id')
  product: Product[];
}
