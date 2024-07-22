export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly desc: string,
    public readonly SKU: string,
    public readonly price: number,
    public readonly category_id: number,
    public readonly quantity: number,
    public readonly files: Array<Express.Multer.File>,
    public readonly discount_id: number,
  ) {}
}
