import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDiscountCommand } from '../impl/update-discount.command';
import { DiscountRepository } from 'src/discount/repositories/discount.repository';

@CommandHandler(UpdateDiscountCommand)
export class UpdateDiscountCommandHandler
  implements ICommandHandler<UpdateDiscountCommand>
{
  constructor(private readonly discountRepository: DiscountRepository) {}
  async execute(
    command: UpdateDiscountCommand,
  ): Promise<[affectedCount: number]> {
    const { id, updateDiscountDto } = command;
    return this.discountRepository.update(id, updateDiscountDto);
  }
}
