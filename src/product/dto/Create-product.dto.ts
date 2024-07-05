import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlpha,
  IsAlphanumeric,
  IsDecimal,
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  isInt,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'stussy' })
  @IsDefined()
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsString()
  @Length(2, 100)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    example:
      'Oversized tee in midweight 6.5oz cotton jersey. Features screenprinted graphics',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsString()
  @Length(2, 1000)
  @Transform(({ value }) => value.trim())
  desc: string;

  @ApiProperty({ example: 'ST120M' })
  @IsDefined()
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsString()
  @Length(4, 10)
  @Transform(({ value }) => value.trim())
  SKU: string;

  @ApiProperty({ example: '45.00' })
  @IsDefined()
  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2,2' })
  @Transform(({ value }) => value.trim())
  price: string;

  @ApiProperty({ example: '1' })
  @IsDefined()
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @IsString()
  @Transform(({ value }) => value.trim())
  category_id: string;

  @ApiProperty({ example: '120' })
  @IsDefined()
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(2, 100)
  @Transform(({ value }) => value.trim())
  quantity: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2,2' })
  @Transform(({ value }) => value.trim())
  discount_id?: string;
}
