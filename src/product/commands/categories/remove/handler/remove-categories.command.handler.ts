import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCategoriesCommand } from '../impl/remove-categories.command';
import { CategoryRepository } from 'src/product/repositories/category.repository';

@CommandHandler(RemoveCategoriesCommand)
export class RemoveCategoriesCommandHandler
  implements ICommandHandler<RemoveCategoriesCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(command: RemoveCategoriesCommand): Promise<number> {
    const { id } = command;
    return this.categoryRepository.removeCategory(id);
  }
}
