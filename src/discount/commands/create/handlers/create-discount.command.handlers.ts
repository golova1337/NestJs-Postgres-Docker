import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDiscountCommand } from '../impl/create-discount.command';
import { DiscountRepository } from 'src/discount/repositories/discount.repository';
import { Discount } from 'src/discount/entities/discount.entity';

@CommandHandler(CreateDiscountCommand)
export class CreateDiscountCommandHandler
  implements ICommandHandler<CreateDiscountCommand>
{
  constructor(private readonly discountRepository: DiscountRepository) {}
  execute(command: CreateDiscountCommand): Promise<Discount> {
    return this.discountRepository.create(command);
  }
}
