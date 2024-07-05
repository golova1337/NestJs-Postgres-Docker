export class RemoveAddressCommand {
  constructor(
    public readonly userId: string,
    public readonly idsAddress: string[],
  ) {}
}
