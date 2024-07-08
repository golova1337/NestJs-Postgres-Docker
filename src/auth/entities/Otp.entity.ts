import { Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Time } from '../enums/time-enaum';
import { User } from './User.entity';

export interface OtpAttributes {
  id: number;
  userId: string;
  otp: string;
  otpExpiresAt: string;
  deletedAt: Date;
}

export interface OtpCreationAttributes
  extends Optional<OtpAttributes, 'id' | 'otpExpiresAt' | 'deletedAt'> {}

@Table({
  tableName: 'otps',
  paranoid: true,
  timestamps: true,
  schema: 'store',
})
export class Otp extends Model<OtpAttributes, OtpCreationAttributes> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otp: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date(Date.now() + Time.tenMinutes),
  })
  otpExpiresAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @BelongsTo(() => User)
  user: User;
}
