import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Sign } from 'src/product/enum/sign-enum';
import { CheckProduct } from '../decorators/constraints/check-product';

export class UpdateItemDto {
  @ApiProperty({ example: '1' })
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @CheckProduct()
  productId: number;

  @ApiProperty({ example: Sign.Plus })
  @Transform(({ value }) => value.trim())
  @IsDefined()
  @IsEnum(Sign)
  sign: Sign;

  @ApiProperty({ example: '1' })
  @IsDefined()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  @Min(1)
  @Max(1000, { message: 'The quantity cannot be more than 1000' })
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
