import { ApiProperty } from '@nestjs/swagger';
import { CreateProductAnswerDto } from '../../create/openApi/create-product-answer.api.dto';
import { DiscountApiDto } from 'src/discount/dto/create/create-discount.api';

export class FindOneProduct extends CreateProductAnswerDto {
  @ApiProperty()
  discount: DiscountApiDto;
}
