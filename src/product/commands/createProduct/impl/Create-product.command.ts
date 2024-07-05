export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly desc: string,
    public readonly SKU: string,
    public readonly price: string,
    public readonly category_id: string,
    public readonly quantity: string,
    public readonly discount_id?: string,
  ) {}
}
