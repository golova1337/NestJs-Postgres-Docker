import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCategoriesCommand } from '../impl/Remove-categories.command';
import { CategoryRepository } from 'src/category/repositories/Category.repository';

@CommandHandler(RemoveCategoriesCommand)
export class RemoveCategoriesCommandHandler
  implements ICommandHandler<RemoveCategoriesCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(command: RemoveCategoriesCommand): Promise<number> {
    const { ids } = command;
    return this.categoryRepository.remove(ids);
  }
}
