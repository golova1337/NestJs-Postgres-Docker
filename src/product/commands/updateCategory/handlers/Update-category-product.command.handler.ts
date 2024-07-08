import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from '../impl/Update-category-product.command';
import { ProductRepository } from 'src/product/repositories/Product.repository';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryProductCommandHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(private readonly productRepository: ProductRepository) {}
  execute(command: UpdateCategoryCommand): Promise<any> {
    const { id, category_id } = command;
    return this.productRepository.updateCategory(id, category_id);
  }
}
