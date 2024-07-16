export class UpdateproductCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly desc: string,
    public readonly SKU: string,
    public readonly price: string,
  ) {}
}
