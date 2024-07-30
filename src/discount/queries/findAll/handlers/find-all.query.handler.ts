import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllDiscountsQuery } from '../impl/find-all.query';
import { DiscountRepository } from 'src/discount/repositories/discount.repository';
import { Discount } from 'src/discount/entities/discount.entity';

@QueryHandler(FindAllDiscountsQuery)
export class FindAllDiscountsQueryHandler
  implements IQueryHandler<FindAllDiscountsQuery>
{
  constructor(private readonly discountRepository: DiscountRepository) {}
  async execute(query: FindAllDiscountsQuery): Promise<Discount[]> {
    let { name } = query;
    name = name ? name : '';
    return this.discountRepository.findAll(name);
  }
}
