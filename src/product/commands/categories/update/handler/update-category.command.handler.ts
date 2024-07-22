import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from '../impl/update-category.command';
import { CategoryRepository } from 'src/product/repositories/category.repository';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(command: UpdateCategoryCommand): Promise<[affectedCount: number]> {
    const { id, category } = command;
    return this.categoryRepository.updateCategory(id, category);
  }
}
