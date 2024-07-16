import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Category } from 'src/category/entities/Product-category.entity';
import { CategoryRepository } from 'src/category/repositories/Category.repository';
import { CreateCategoryCommand } from '../impl/Create-category.command';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(command: CreateCategoryCommand): Promise<Category> {
    return this.categoryRepository.create(command);
  }
}
