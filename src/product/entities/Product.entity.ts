import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductDiscount } from './Product-discount.entity';
import { ProductInventory } from './Product-inventory.entity';
import { Category } from 'src/category/entities/Product-category.entity';

export interface ProductAttributes {
  id: string;
  name: string;
  desc: string;
  SKU: string;
  category_id: string;
  inventory_id: string;
  price: string;
  discount_id: string;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}

export interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    'id' | 'discount_id' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  timestamps: true,
  tableName: 'products',
  paranoid: true,
  schema: 'store',
  indexes: [
    {
      unique: true,
      fields: ['name', 'SKU'],
    },
  ],
})
export class Product extends Model<
  ProductAttributes,
  ProductCreationAttributes
> {
  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  desc: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  SKU: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  category_id: string;

  @ForeignKey(() => ProductInventory)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  inventory_id: string;

  @ForeignKey(() => ProductDiscount)
  @Column({ type: DataType.INTEGER, allowNull: true })
  discount_id?: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @BelongsTo(() => ProductDiscount)
  discount: ProductDiscount;

  @BelongsTo(() => ProductInventory)
  inventory: ProductInventory;

  @BelongsTo(() => Category)
  category: Category;
}
