import { CreateProductDto } from 'src/product/dto/product/create/create-product.dto';

export class CreateProductCommand {
  constructor(
    public readonly product: CreateProductDto,
    public readonly files: Array<Express.Multer.File>,
  ) {}
}
