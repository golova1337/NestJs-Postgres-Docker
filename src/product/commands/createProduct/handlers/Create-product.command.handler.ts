import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Product } from 'src/product/entities/Product.entity';
import { ProductInventory } from 'src/product/entities/Product-inventory.entity';
import { ProductRepository } from 'src/product/repositories/Product.repository';
import { CreateProductCommand } from '../impl/Create-product.command';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    command: CreateProductCommand,
  ): Promise<{ product: Product; inventory: ProductInventory }> {
    const { quantity, ...product } = command;

    return this.productRepository.createProduct(product, quantity);
  }
}
