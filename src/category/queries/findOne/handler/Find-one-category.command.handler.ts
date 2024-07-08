import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneCategoryQueryCommand } from '../impl/Find-one-category.command';
import { CategoryRepository } from 'src/category/repositories/Category.repository';
import { Category } from 'src/category/entities/Product-category.entity';

@QueryHandler(FindOneCategoryQueryCommand)
export class FindOneCategoryQueryHandler
  implements IQueryHandler<FindOneCategoryQueryCommand>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(query: FindOneCategoryQueryCommand): Promise<Category | null> {
    const { id } = query;
    return this.categoryRepository.findOnePk(id);
  }
}
