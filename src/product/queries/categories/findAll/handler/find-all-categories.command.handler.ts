import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllCategoriesQuery } from '../impl/find-all-categories.command';
import { CategoryRepository } from 'src/product/repositories/category.repository';
import { Category } from 'src/product/entities/category.entity';

@QueryHandler(FindAllCategoriesQuery)
export class FindAllCategoriesQueryHandler
  implements IQueryHandler<FindAllCategoriesQuery>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(command: FindAllCategoriesQuery): Promise<Category[]> {
    return this.categoryRepository.findAllCategory();
  }
}
