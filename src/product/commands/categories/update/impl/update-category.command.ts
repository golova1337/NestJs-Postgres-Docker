import { UpdateCategoryDto } from 'src/product/dto/category/update/update-category.dto';

export class UpdateCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly category: UpdateCategoryDto,
  ) {}
}
