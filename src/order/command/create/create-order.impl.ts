export class CreateOrderCommand {
  constructor(
    public readonly userId: number,
    public readonly cacheCart: { cart: any[]; total: number },
  ) {}
}
