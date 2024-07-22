import { ApiProperty } from '@nestjs/swagger';
import { CreatedProductDto } from '../../create/openApi/created-product.api.dto';

export class FindAllAnswerDto {
  @ApiProperty({ example: '1' })
  count: string;
  @ApiProperty()
  rows: CreatedProductDto[];
}
