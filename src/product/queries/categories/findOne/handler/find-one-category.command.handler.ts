import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneCategoryQueryCommand } from '../impl/find-one-category.command';
import { Category } from 'src/product/entities/category.entity';
import { CategoryRepository } from 'src/product/repositories/category.repository';

@QueryHandler(FindOneCategoryQueryCommand)
export class FindOneCategoryQueryHandler
  implements IQueryHandler<FindOneCategoryQueryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(query: FindOneCategoryQueryCommand): Promise<Category | null> {
    const { id } = query;
    return this.categoryRepository.findCategoryById(id);
  }
}
