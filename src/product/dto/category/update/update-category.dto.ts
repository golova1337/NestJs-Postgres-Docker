import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from '../create/create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
