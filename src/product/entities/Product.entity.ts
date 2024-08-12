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
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Review } from 'src/reviews/entities/review.entity';

export interface ProductAttributes {
  id: number;
  name: string;
  desc: string;
  SKU: string;
  category_id: number;
  inventory_id: number;
  price: number;
  discount_id: number;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, 'id' | 'discount_id'> {}

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

  @BelongsTo(() => Discount)
  discount: Discount;

  @BelongsTo(() => Inventory)
  inventory: Inventory;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => File, 'product_id')
  files: File[];

  @HasMany(() => OrderItem, 'product_id')
  orderItems: OrderItem[];

  @HasMany(() => Review, 'product_id')
  reviews: Review[];
}
