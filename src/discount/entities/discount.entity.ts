import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from 'src/product/entities/product.entity';

export interface DiscountAttributes {
  id: string;
  name: string;
  disc: string;
  discount_percent: number;
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
  indexes: [
    {
      unique: true,
      fields: ['name', 'discount_percent'],
    },
  ],
})
export class Discount extends Model<
  DiscountAttributes,
  DiscountCreationAttributes
> {
  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  disc: string;

  @Column({ type: DataType.DECIMAL(4, 2), allowNull: false })
  discount_percent: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @HasMany(() => Product, 'discount_id')
  product: Product[];
}
