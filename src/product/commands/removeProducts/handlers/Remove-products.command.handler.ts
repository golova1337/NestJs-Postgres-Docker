import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProductsCommand } from '../impl/Remove-products.command';
import { ProductRepository } from 'src/product/repositories/Product.repository';

@CommandHandler(RemoveProductsCommand)
export class RemoveProductsCommandHandler
  implements ICommandHandler<RemoveProductsCommand>
{
  constructor(private readonly productRepository: ProductRepository) {}
  execute(command: RemoveProductsCommand): Promise<any> {
    const { ids } = command;
    return this.productRepository.remove(ids);
  }
}
