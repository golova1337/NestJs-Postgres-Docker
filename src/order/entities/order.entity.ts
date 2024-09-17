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
import { OrderStatus } from '../enum/order-status.enum';
import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payment/entities/payment.entity';

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
