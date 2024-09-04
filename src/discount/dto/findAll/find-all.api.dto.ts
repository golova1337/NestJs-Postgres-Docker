import { ApiProperty } from '@nestjs/swagger';
import { DiscountApiDto } from '../create/create-discount.api';

export class FindAllDiscounts {
  @ApiProperty({ type: [DiscountApiDto] })
  discounts: DiscountApiDto[];
}
