import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProductsCommand } from '../impl/remove-products.command';
import { ProductRepository } from 'src/product/repositories/product.repository';

@CommandHandler(RemoveProductsCommand)
export class RemoveProductsCommandHandler
  implements ICommandHandler<RemoveProductsCommand>
{
  constructor(private readonly productRepository: ProductRepository) {}
  execute(command: RemoveProductsCommand): Promise<any> {
    const { ids } = command;
    return this.productRepository.removeProduct(ids);
  }
}
