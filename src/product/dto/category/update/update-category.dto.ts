import { PickType } from '@nestjs/swagger';
import { CreateCategoryDto } from '../create/create-category.dto';

export class UpdateCategoryDto extends PickType(CreateCategoryDto, [
  'desc',
  'name',
] as const) {}
