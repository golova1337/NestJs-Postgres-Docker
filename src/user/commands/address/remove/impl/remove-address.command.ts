export class RemoveAddressCommand {
  constructor(
    public readonly userId: number,
    public readonly ids: number[],
  ) {}
}
