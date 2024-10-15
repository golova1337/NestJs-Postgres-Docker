import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/order/entities/order.entity';
import { PaymentProvider } from '../enum/provider.enum';
import { PaymentStatus } from '../enum/payment-status.enum';

interface PaymentAttributes {
  id: number;
  order_id: number;
  amount: number;
  provider: PaymentProvider;
  status: PaymentStatus;
}

export interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, 'id'> {}
@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'payment_details',
  schema: 'store',
})
export class Payment extends Model<
  PaymentCreationAttributes,
  PaymentAttributes
> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  order_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentProvider)),
    allowNull: false,
  })
  provider: PaymentProvider;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: false,
  })
  status: PaymentStatus;

  @HasOne(() => Order)
  order: Order;
}
