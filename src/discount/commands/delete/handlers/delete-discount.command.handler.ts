import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDiscountCommand } from '../impl/delete-discount.command';
import { DiscountRepository } from 'src/discount/repositories/discount.repository';

@CommandHandler(DeleteDiscountCommand)
export class DeleteDiscountCommandHandler
  implements ICommandHandler<DeleteDiscountCommand>
{
  constructor(private readonly discountRepository: DiscountRepository) {}
  async execute(command: DeleteDiscountCommand): Promise<any> {
    const { ids } = command;
    return this.discountRepository.remove(ids);
  }
}
