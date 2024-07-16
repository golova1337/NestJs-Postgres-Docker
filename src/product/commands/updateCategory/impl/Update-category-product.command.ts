export class UpdateCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly category_id: string,
  ) {}
}
