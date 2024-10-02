import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneProductQuery } from '../impl/find-one-product.query';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { ReviewRepository } from 'src/reviews/repositories/review.repository';

@QueryHandler(FindOneProductQuery)
export class FindOneProductQueryHandler
  implements IQueryHandler<FindOneProductQuery>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}
  async execute(query: FindOneProductQuery): Promise<any> {
    const { id } = query;
    let product = await this.productRepository.findProductById(id);
    const averageProductRating =
      await this.reviewRepository.averageProductRating(id);

    return {
      ...product.get(),
      avgRating: averageProductRating['avgRating'],
    };
  }
}
