import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Product } from 'src/product/entities/product.entity';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { FindManyProductsByIdsCommand } from '../impl/summary.command';

@QueryHandler(FindManyProductsByIdsCommand)
export class FindManyProductsByIdsCommandHandler
  implements IQueryHandler<FindManyProductsByIdsCommand>
{
  constructor(private readonly productRepository: ProductRepository) {}
  execute(query: FindManyProductsByIdsCommand): Promise<Product[]> {
    const { ids } = query;
    return this.productRepository.findManyProductsByIds(ids);
  }
}
