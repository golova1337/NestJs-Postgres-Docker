import { ApiProperty } from '@nestjs/swagger';
import { DiscountApiDto } from 'src/discount/dto/create/create-discount.api';
import { CreateProductAnswerDto } from '../../create/openApi/create-product-answer.api.dto';

export class FindOneProduct extends CreateProductAnswerDto {
  @ApiProperty()
  discount: DiscountApiDto;
}
