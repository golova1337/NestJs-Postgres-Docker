export class InsertJwtCommand {
  constructor(
    public readonly id: number,
    public readonly token: string,
  ) {}
}
