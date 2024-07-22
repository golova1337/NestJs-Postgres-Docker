import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.entity';

export interface JwtAttributes {
  id: number;
  userId: number;
  token: string;
  deletedAt: Date;
}
export interface JwtCreationAttributes
  extends Optional<JwtAttributes, 'id' | 'deletedAt'> {}

@Table({
  tableName: 'tokens',
  schema: 'store',
  timestamps: true,
  paranoid: true,
})
export class Jwt extends Model<JwtAttributes, JwtCreationAttributes> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  userId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  token: string;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @BelongsTo(() => User)
  user: User;
}
