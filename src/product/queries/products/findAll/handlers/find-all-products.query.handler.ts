import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllProductsQuery } from '../impl/find-all-products.query';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { Product } from 'src/product/entities/product.entity';

@QueryHandler(FindAllProductsQuery)
export class FindAllProductsQueryHandler
  implements IQueryHandler<FindAllProductsQuery>
{
  constructor(private readonly productRepository: ProductRepository) {}
  execute(
    query: FindAllProductsQuery,
  ): Promise<{ rows: Product[]; count: number }> {
    return this.productRepository.findAllProduct(query);
  }
}
