export class UpdateCategoryProductCommand {
  constructor(
    public readonly id: number,
    public readonly category_id: string,
  ) {}
}
