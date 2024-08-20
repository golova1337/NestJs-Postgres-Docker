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
import { User } from 'src/auth/entities/user.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { OrderStatus } from '../enum/order-status.enum';
import { OrderItem } from './order-item.entity';

interface OrderAttributes {
  id: number;
  user_id: number;
  payment_id: number;
  status: OrderStatus;
  total_amount: number;
}

export interface OrderCreationAttributes
  extends Optional<OrderAttributes, 'id' | 'payment_id' | 'total_amount'> {}
@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'orders',
  schema: 'store',
})
export class Order extends Model<OrderCreationAttributes, OrderAttributes> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
  })
  status: OrderStatus;

  @ForeignKey(() => Payment)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  payment_id: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  total_amount: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @BelongsTo(() => Payment)
  payment: Payment;
}
