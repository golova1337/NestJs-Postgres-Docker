import { PickType } from '@nestjs/swagger';
import { CreateProductDto } from './Create-product.dto';

export class UpdateProductDto extends PickType(CreateProductDto, [
  'name',
  'desc',
  'SKU',
  'price',
]) {}
