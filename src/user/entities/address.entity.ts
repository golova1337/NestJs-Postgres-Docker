import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/auth/entities/User.entity';

export interface UserAddressAttributes {
  id: number;
  userId: string;
  street: string;
  house: string;
  apartment: string;
  city: string;
  country: string;
  postal_code: string;
  phone: string;
}
interface UserAddressCreationAttributes
  extends Optional<UserAddressAttributes, 'id' | 'phone' | 'apartment'> {}
@Table({
  tableName: 'user_addresses',
  schema: 'store',
  paranoid: false,
  indexes: [
    {
      fields: ['userId', 'country', 'city', 'street', 'house'],
      unique: true,
    },
  ],
})
export class UserAddress extends Model<
  UserAddressAttributes,
  UserAddressCreationAttributes
> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: false })
  userId: string;
  @Column({ type: DataType.STRING(150), allowNull: false, unique: false })
  country: string;
  @Column({ type: DataType.STRING(150), allowNull: false, unique: false })
  city: string;
  @Column({ type: DataType.STRING(150), allowNull: false, unique: false })
  street: string;
  @Column({ type: DataType.STRING(15), allowNull: false, unique: false })
  house: string;
  @Column({ type: DataType.STRING(15), allowNull: true, unique: false })
  apartment?: string;
  @Column({ type: DataType.STRING(10), allowNull: false, unique: false })
  postal_code: string;
  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    unique: false,
  })
  phone?: string;

  @BelongsTo(() => User)
  user: User;
}
