import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from './Product.entity';

export interface ProductCategoryAttributes {
  id: string;
  name: string;
  desc: string;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}

export interface ProductCategoryCreationAttributes
  extends Optional<
    ProductCategoryAttributes,
    'id' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  timestamps: true,
  tableName: 'product_categories',
  paranoid: true,
  schema: 'store',
})
export class ProductCategory extends Model<
  ProductCategoryAttributes,
  ProductCategoryCreationAttributes
> {
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  name: string;
  @Column({ type: DataType.TEXT, allowNull: false })
  desc: string;
  @Column({ type: DataType.DATE, allowNull: false })
  createdAt?: Date;
  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt?: Date;
  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;

  @HasMany(() => Product, 'category_id')
  product: Product[];
}
