import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'stussy' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
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
  @IsString()
  @Length(2, 1000)
  desc: string;

  @ApiProperty({ example: 'ST120M' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @Length(4, 10)
  SKU: string;

  @ApiProperty({ example: '45.00' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty({ example: '1' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  @IsInt()
  category_id: number;

  @ApiProperty({ example: '120' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  files?: any[];
}
