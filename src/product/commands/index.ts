import { CreateProductCommandHandler } from './create/handlers/create-product.command.handler';
import { RemoveProductFilesCommandHandler } from './removeImages/handlers/remove-product-images.command.handler';
import { UpdateProductCommandHandler } from './update/handlers/update-product.command.handler';

export const ProductCommandHandlers = [
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  RemoveProductFilesCommandHandler,
];
