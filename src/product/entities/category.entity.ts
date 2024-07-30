import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from 'src/product/entities/product.entity';

export interface CategoryAttributes {
  id: number;
  name: string;
  desc: string;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}

export interface CategoryCreationAttributes
  extends Optional<
    CategoryAttributes,
    'id' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  timestamps: true,
  tableName: 'categories',
  paranoid: true,
  schema: 'store',
})
export class Category extends Model<
  CategoryAttributes,
  CategoryCreationAttributes
> {
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.TEXT('medium'), allowNull: false })
  desc: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @HasMany(() => Product, 'category_id')
  products: Product[];
}
