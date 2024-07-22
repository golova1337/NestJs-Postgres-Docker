import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from '../impl/create-category.command';
import { CategoryRepository } from 'src/product/repositories/category.repository';
import { Category } from 'src/product/entities/category.entity';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(command: CreateCategoryCommand): Promise<Category> {
    return this.categoryRepository.createCategory(command);
  }
}
