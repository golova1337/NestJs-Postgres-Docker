export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly desc: string,
    public readonly SKU: string,
    public readonly price: string,
    public readonly category_id: string,
    public readonly quantity: string,
    public readonly author_id: string,
    public readonly files: Array<Express.Multer.File>,
    public readonly discount_id: string,
  ) {}
}
