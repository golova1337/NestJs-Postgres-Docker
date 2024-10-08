import { UpdateProductDto } from 'src/product/dto/product/update/update-product.dto';

export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly files: Array<Express.Multer.File>,
    public readonly updateProductDto: UpdateProductDto,
  ) {}
}
