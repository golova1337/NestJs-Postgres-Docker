export class RemoveItemCommand {
  constructor(
    public readonly itemId: number,
    public readonly userId: number,
  ) {}
}
