export interface UpdateCategory {
  name: string;
  desc: string;
}

export class UpdateCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly category: UpdateCategory,
  ) {}
}
