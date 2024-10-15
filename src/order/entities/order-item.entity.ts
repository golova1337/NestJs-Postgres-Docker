import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';

interface OrderItemAttributes {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, 'id'> {}
@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'order_items',
  schema: 'store',
})
export class OrderItem extends Model<
  OrderItemCreationAttributes,
  OrderItemAttributes
> {
  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  order_id: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  product_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  unit_price: number;

  @BelongsTo(() => Order)
  order: Order;

  @BelongsTo(() => Product)
  product: Product;
}
