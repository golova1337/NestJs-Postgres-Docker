import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from '../../create/create-product.dto';

export class FindAllAnswerDto {
  @ApiProperty({ example: '1' })
  count: string;
  @ApiProperty()
  rows: CreateProductDto[];
}
