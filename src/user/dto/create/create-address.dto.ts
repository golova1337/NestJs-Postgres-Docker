import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAddressUserDto {
  @ApiProperty({ example: 'Zaporizhzhia' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/)
  @MaxLength(150)
  city: string;

  @ApiProperty({ example: 'Ukraine' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDefined()
  @Matches(/^[a-zA-Z0-9]+$/)
  @MaxLength(150)
  country: string;

  @ApiProperty({ example: 'Soborny Avenue' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[\w\s.-]+$/, {
    message: 'Street must contain only letters,  hyphen and spaces',
  })
  street: string;

  @ApiProperty({ example: '12G' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'house must contain only letters, numbers, and spaces',
  })
  @MaxLength(150)
  house: string;

  @ApiProperty({ example: '22' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'house must contain only letters, numbers, and spaces',
  })
  @MaxLength(150)
  apartment?: string;

  @ApiProperty({ example: '69061' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsNotEmpty()
  @IsPostalCode('UA')
  postal_code: string;

  @ApiProperty({ example: '+380507777777' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  @Matches(/^[0-9+]+$/, {
    message: 'Phone must contain only  numbers and plus',
  })
  phone?: string;
}
