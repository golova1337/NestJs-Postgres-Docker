export class FindOneAddressByIdQuery {
  constructor(
    public readonly userId: number,
    public readonly addressId: number,
  ) {}
}
