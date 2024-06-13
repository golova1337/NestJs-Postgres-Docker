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
import { User } from './user.entity';

export interface VerificationAttributes {
  id: number;
  userId: string;
  verificationCode: string;
  verificationCodeExpiresAt: string;
  deletedAt: Date;
}

export interface VerificationCreationAttributes
  extends Optional<
    VerificationAttributes,
    'id' | 'verificationCodeExpiresAt' | 'deletedAt'
  > {}

@Table({
  tableName: 'verification_codes',
  paranoid: true,
  timestamps: true,
  schema: 'store',
})
export class VerificationCodes extends Model<
  VerificationAttributes,
  VerificationCreationAttributes
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verificationCode: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date(Date.now() + Time.tenMinutes),
  })
  verificationCodeExpiresAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @BelongsTo(() => User)
  user: User;
}
