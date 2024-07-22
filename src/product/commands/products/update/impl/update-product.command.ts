import { Sign } from 'src/product/enum/sign-enum';

export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly desc: string,
    public readonly SKU: string,
    public readonly price: number,
    public readonly category_id: number,
    public readonly quantity: number,
    public readonly files: Array<Express.Multer.File>,
    public readonly discount_id: number,
    public readonly sign: Sign,
    public readonly changeQuantity: number,
  ) {}
}
