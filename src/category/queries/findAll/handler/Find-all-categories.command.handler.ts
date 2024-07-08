import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Category } from 'src/category/entities/Product-category.entity';
import { CategoryRepository } from 'src/category/repositories/Category.repository';
import { FindAllCategoriesQuery } from '../impl/Find-all-categories.command';

@QueryHandler(FindAllCategoriesQuery)
export class FindAllCategoriesQueryHandler
  implements IQueryHandler<FindAllCategoriesQuery>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute(command: FindAllCategoriesQuery): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
