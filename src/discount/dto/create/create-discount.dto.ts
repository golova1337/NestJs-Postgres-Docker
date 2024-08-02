import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
  Validate,
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
  disc: string;

  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @Validate(({ value }) => {
    return (
      typeof value === 'number' && /^\d+(\.\d{1,2})?$/.test(value.toString())
    );
  })
  @IsPositive()
  discount_percent: number;
}
