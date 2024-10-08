import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllCommand } from '../impl/find-all.command';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { FiltrationUtils, PaginationResult } from 'src/utils/filtration';
import { Product } from 'src/product/entities/product.entity';

@QueryHandler(FindAllCommand)
export class FindAllCommandHandler implements IQueryHandler<FindAllCommand> {
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(
    query: FindAllCommand,
  ): Promise<{ products: Product[]; count: number }> {
    const { filtration } = query;

    const { perPage, page, minPrice, maxPrice, sort, sortBy } = filtration;
    const pagination: PaginationResult = FiltrationUtils.pagination(
      page,
      perPage,
    );

    const price = { minPrice, maxPrice };
    const order = { sort, sortBy };

    let { count, products } = await this.productRepository.findAllProduct({
      pagination,
      price,
      order,
    });

    await this.calculatePriceWithDiscount(products);

    return { products, count };
  }

  async calculatePriceWithDiscount(products) {
    for (const product of products) {
      if (product.discount) {
        product.dataValues['priceWithDiscount'] =
          product.price -
          (product.price * product.discount['discount_percent']) / 100;
      }
    }
  }
}
