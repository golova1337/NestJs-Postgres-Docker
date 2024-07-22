export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly desc: string,
  ) {}
}
