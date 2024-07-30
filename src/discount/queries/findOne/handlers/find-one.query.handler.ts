import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneDiscountQuery } from '../impl/find-one.query';
import { DiscountRepository } from 'src/discount/repositories/discount.repository';
import { Discount } from 'src/discount/entities/discount.entity';

@QueryHandler(FindOneDiscountQuery)
export class FindOneDiscountQueryHandler
  implements IQueryHandler<FindOneDiscountQuery>
{
  constructor(private readonly discountRepository: DiscountRepository) {}
  execute(query: FindOneDiscountQuery): Promise<Discount | null> {
    const { id } = query;
    return this, this.discountRepository.findOne(id);
  }
}
