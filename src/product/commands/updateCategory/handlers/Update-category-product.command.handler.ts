import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryProductCommand } from '../impl/Update-category-product.command';
import { ProductRepository } from 'src/product/repository/Product.repository';

@CommandHandler(UpdateCategoryProductCommand)
export class UpdateCategoryProductCommandHandler
  implements ICommandHandler<UpdateCategoryProductCommand>
{
  constructor(private readonly productRepository: ProductRepository) {}
  execute(command: UpdateCategoryProductCommand): Promise<any> {
    const { id, category_id } = command;
    return this.productRepository.updateCategory(id, category_id);
  }
}
