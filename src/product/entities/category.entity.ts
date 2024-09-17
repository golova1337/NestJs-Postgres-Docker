import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from './product.entity';

export interface CategoryAttributes {
  id: number;
  name: string;
  desc: string;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id'> {}

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

  @Column({
    type: DataType.STRING({ length: 100000 }),
    allowNull: false,
  })
  desc: string;

  @HasMany(() => Product, 'category_id')
  products: Product[];
}
