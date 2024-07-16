import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoryRepository } from 'src/category/repositories/Category.repository';
import { UpdateCategoryCommand } from '../impl/Update-category.command';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(command: UpdateCategoryCommand): Promise<[affectedCount: number]> {
    const { id, category } = command;
    return this.categoryRepository.update(id, category);
  }
}
