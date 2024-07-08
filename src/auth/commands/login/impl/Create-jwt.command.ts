export class InsertJwtCommand {
  constructor(
    public readonly id: string,
    public readonly token: string,
  ) {}
}
