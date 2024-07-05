import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateproductCommand } from '../impl/Update-product.command';
import { ProductRepository } from 'src/product/repository/Product.repository';

@CommandHandler(UpdateproductCommand)
export class UpdateProductCommandHandler
  implements ICommandHandler<UpdateproductCommand>
{
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(
    command: UpdateproductCommand,
  ): Promise<[affectedCount: number]> {
    const { id, ...rest } = command;
    return this.productRepository.update(id, rest);
  }
}
