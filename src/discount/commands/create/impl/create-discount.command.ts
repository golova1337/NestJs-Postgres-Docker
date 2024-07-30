export class CreateDiscountCommand {
  constructor(
    public readonly name: string,
    public readonly disc: string,
    public readonly discount_percent: number,
  ) {}
}
