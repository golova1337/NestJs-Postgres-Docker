import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { File } from './file.entity';
import { Category } from './category.entity';
import { Discount } from 'src/discount/entities/discount.entity';
import { Inventory } from './inventory.entity';

export interface ProductAttributes {
  id: number;
  name: string;
  desc: string;
  SKU: string;
  category_id: number;
  inventory_id: number;
  price: number;
  discount_id: number;
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
  category_id: number;

  @ForeignKey(() => Inventory)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  inventory_id: number;

  @ForeignKey(() => Discount)
  @Column({ type: DataType.INTEGER, allowNull: true })
  discount_id?: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @BelongsTo(() => Discount)
  discount: Discount;

  @BelongsTo(() => Inventory)
  inventory: Inventory;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => File, 'product_id')
  files: File[];
}
