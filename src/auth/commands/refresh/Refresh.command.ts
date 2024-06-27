export class RefreshCommand {
  constructor(
    public readonly id: string,
    public readonly role: string,
    public readonly refreshToken: string,
  ) {}
}
