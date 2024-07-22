import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/product/entities/product.entity';
import { ShoppingSession } from './shopping-session.entity';

export interface CartItemAttributes {
  id: string;
  session_id: string;
  product_id: string;
  quantity: string;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}
export interface CartItemCreationAttributes
  extends Optional<
    CartItemAttributes,
    'id' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  timestamps: true,
  tableName: 'cart_items',
  paranoid: true,
  schema: 'store',
  indexes: [{ fields: ['session_id', 'product_id'], unique: true }],
})
export class CartItem extends Model<
  CartItemAttributes,
  CartItemCreationAttributes
> {
  @ForeignKey(() => ShoppingSession)
  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  session_id: string;
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  product_id: string;
  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: string;
  @BelongsTo(() => ShoppingSession)
  cart: ShoppingSession;
  @BelongsTo(() => Product)
  product: Product;
}
