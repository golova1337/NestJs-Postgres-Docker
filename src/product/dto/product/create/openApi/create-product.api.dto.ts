import { ApiProperty } from '@nestjs/swagger';
import { CreatedProductDto } from './created-product.api.dto';

class InventoryDto {
  @ApiProperty({ example: '120' })
  quantity: string;
}

export class CreateProductAnswerDto {
  @ApiProperty()
  product: CreatedProductDto;
  @ApiProperty()
  inventory: InventoryDto;
}
