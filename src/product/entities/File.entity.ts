import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.entity';
import { MIME } from 'src/product/enum/multer-enum';
import { User } from 'src/auth/entities/user.entity';

export interface FileAttributes {
  id: string;
  product_id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  metadata: object;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
}
export interface FileCreationAttributes
  extends Optional<
    FileAttributes,
    'id' | 'metadata' | 'createdAt' | 'updateAt' | 'deletedAt'
  > {}

@Table({
  tableName: 'files',
  schema: 'store',
  paranoid: true,
  timestamps: true,
})
export class File extends Model<FileAttributes, FileCreationAttributes> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  product_id: string;

  @BelongsTo(() => Product)
  product: Product;

  @Column({ type: DataType.STRING, allowNull: false })
  filename: string;

  @Column({ type: DataType.STRING, allowNull: false })
  originalname: string;

  @Column({
    type: DataType.ENUM(...Object.values(MIME)),
    allowNull: false,
  })
  mimetype: MIME;

  @Column({
    type: DataType.BIGINT({ unsigned: true }),
    allowNull: false,
  })
  size: number;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  metadata?: object;
}
