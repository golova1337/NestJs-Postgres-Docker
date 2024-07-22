import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/auth/entities/user.entity';
import { CartItem } from './cart-item.entity';

export interface ShoppingSessionAttributes {
  id: string;
  user_id: string;
  total: string;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}
export interface ShoppingSessionCreationAttributes
  extends Optional<
    ShoppingSessionAttributes,
    'id' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  timestamps: true,
  tableName: 'shopping_sessions',
  paranoid: true,
  schema: 'store',
  indexes: [{ fields: ['id', 'user_id'], unique: true }],
})
export class ShoppingSession extends Model<
  ShoppingSessionAttributes,
  ShoppingSessionCreationAttributes
> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  user_id: string;
  @Column({ type: DataType.DECIMAL, allowNull: false })
  total: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => CartItem)
  items: CartItem[];
}
