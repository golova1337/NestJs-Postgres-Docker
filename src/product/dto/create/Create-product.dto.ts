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
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    example:
      'Oversized tee in midweight 6.5oz cotton jersey. Features screenprinted graphics',
  })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsString()
  @Length(2, 1000)
  desc: string;

  @ApiProperty({ example: 'ST120M' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsString()
  @Length(4, 10)
  SKU: string;

  @ApiProperty({ example: '45.00' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2,2' })
  price: string;

  @ApiProperty({ example: '1' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @IsString()
  category_id: string;

  @ApiProperty({ example: '120' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(2, 100)
  quantity: string;

  @ApiProperty({ example: '1' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2,2' })
  discount_id?: string;
}
