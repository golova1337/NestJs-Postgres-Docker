import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneProductQuery } from '../impl/find-one-product.query';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { Product } from 'src/product/entities/product.entity';

@QueryHandler(FindOneProductQuery)
export class FindOneProductQueryHAndler
  implements IQueryHandler<FindOneProductQuery>
{
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(query: FindOneProductQuery): Promise<Product | null> {
    const { id } = query;
    return this.productRepository.findProductById(id);
  }
}
