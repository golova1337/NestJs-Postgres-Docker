import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length
} from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  name: string;

  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @Length(10, 300)
  desc: string;

  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  discount_percent: number;
}
