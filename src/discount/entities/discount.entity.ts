import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from 'src/product/entities/product.entity';

export interface DiscountAttributes {
  id: string;
  name: string;
  disc: string;
  discount_percent: number;
}

export interface DiscountCreationAttributes
  extends Optional<DiscountAttributes, 'id'> {}

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
  discount_percent: number;

  @HasMany(() => Product, 'discount_id')
  product: Product[];
}
