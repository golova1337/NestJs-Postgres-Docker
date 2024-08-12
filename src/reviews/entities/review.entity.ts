import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
export interface ReviewAttributes {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
}

export interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, 'id' | 'comment'> {}

@Table({
  timestamps: true,
  tableName: 'reviews',
  paranoid: true,
  schema: 'store',
})
export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  product_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  })
  rating: number;

  @Column({
    type: DataType.STRING(250),
    allowNull: true,
  })
  comment: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => User)
  user: User;
}
