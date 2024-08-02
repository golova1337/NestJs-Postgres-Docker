import { Optional } from 'sequelize';
import { OrderStatus } from '../enum/order-status.enum';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from 'src/payment/entities/payment.entity';

interface OrderAttributes {
  id: number;
  user_id: number;
  payment_id: number;
  status: OrderStatus;
  total_amount: number;
}

export interface OrderCreationAttributes
  extends Optional<OrderAttributes, 'id' | 'payment_id'> {}
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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  payment_id: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  total_amount: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @HasOne(() => Payment)
  payment: Payment;
}
