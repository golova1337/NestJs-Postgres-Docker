import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { DiscountExists } from 'src/product/decorators/constraint/discount-exists';

export class ApplyDiscountDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @DiscountExists({ message: 'the discount does not exist' })
  @IsInt()
  discountId: number;
}
