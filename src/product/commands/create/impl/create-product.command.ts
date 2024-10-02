import { CreateProductDto } from 'src/product/dto/create/create-product.dto';
import { UploadedFile } from 'src/product/interfaces/uploadedFiles.interface';

export class CreateProductCommand {
  constructor(
    public readonly product: CreateProductDto,
    public readonly files: Array<UploadedFile> | undefined,
  ) {}
}
