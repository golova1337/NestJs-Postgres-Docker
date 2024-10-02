import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from '../create-product.dto';

export class InventoryDto {
  @ApiProperty({ example: '120' })
  quantity: string;
}

export class CreateProductAnswerDto {
  @ApiProperty({ type: CreateProductDto })
  product: CreateProductDto;
  @ApiProperty({ type: InventoryDto })
  inventory: InventoryDto;
  @ApiProperty({ type: [String] })
  files: [];
}
