import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneProductQuery } from '../impl/Find-one-product.query';
import { ProductRepository } from 'src/product/repositories/Product.repository';
import { Product } from 'src/product/entities/Product.entity';

@QueryHandler(FindOneProductQuery)
export class FindOneProductQueryHAndler
  implements IQueryHandler<FindOneProductQuery>
{
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(query: FindOneProductQuery): Promise<Product | null> {
    return this.productRepository.findByPk(query.id);
  }
}
