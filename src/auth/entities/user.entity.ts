import { Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  DataType,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { Roles } from '../enums/roles-enum';
import { RegistrationMethod } from '../enums/registMethod-enum';
import { Jwt } from './Jwt.entity';
import { UserAddress } from 'src/user/entities/address.entity';
import { Otp } from './Otp.entity';

export interface PersonAttributes {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  token: string;
  isVerified: boolean;
}

export interface PersonCreationAttributes
  extends Optional<
    PersonAttributes,
    'id' | 'role' | 'token' | 'isVerified' | 'name' | 'lastname'
  > {}

@Table({
  timestamps: true,
  tableName: 'users',
  paranoid: true,
  schema: 'store',
})
export class User extends Model<PersonAttributes, PersonCreationAttributes> {
  @Column({ type: DataType.STRING(32), unique: false, allowNull: true })
  name?: string;

  @Column({ type: DataType.STRING(52), unique: false, allowNull: true })
  lastname?: string;

  @Column({
    type: DataType.STRING(32),
    unique: true,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(20),
    unique: true,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING(160),
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: {
        args: [30, 100],
        msg: 'The length must be min 30, max 100',
      },
    },
  })
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Roles)),
    defaultValue: Roles.User,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  })
  role?: Roles;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  isVerified: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(RegistrationMethod)),
    allowNull: false,
  })
  registrationMethod: RegistrationMethod;

  @HasOne(() => Otp)
  otp: Otp;

  @HasOne(() => Jwt)
  jwt: Jwt;

  @HasMany(() => UserAddress)
  address: UserAddress[];
}
