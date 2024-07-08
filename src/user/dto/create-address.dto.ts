import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';
import { UserAddressAttributes } from '../entities/Address.entity';
type UserAddressDto = Partial<Omit<UserAddressAttributes, 'id' | 'userId'>>;

interface IUserAddressDto extends UserAddressDto {}

export class CreateAddressUserDto implements IUserAddressDto {
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/)
  @MaxLength(150)
  city: string;

  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/)
  @MaxLength(150)
  country: string;

  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[\w\s-]+$/, {
    message:
      'Address Line 1 must contain only letters, numbers, hyphen and spaces',
  })
  street: string;

  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'house must contain only letters, numbers, and spaces',
  })
  @MaxLength(150)
  house: string;

  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'house must contain only letters, numbers, and spaces',
  })
  @MaxLength(150)
  apartment?: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Postal code must contain only letters and numbers',
  })
  postal_code: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Phone must contain only letters and numbers',
  })
  phone?: string;
}
