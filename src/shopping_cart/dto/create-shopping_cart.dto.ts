import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty } from 'class-validator';
import { CheckProduct } from '../decorators/constraints/check-product';

export class CreateCartItemDto {
  @ApiProperty({ example: '1' })
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @CheckProduct()
  productId: number;

  @ApiProperty({ example: '1' })
  @IsDefined()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
