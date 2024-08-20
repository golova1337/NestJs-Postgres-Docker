export class JwtCreationCommand {
  constructor(
    public readonly id: number,
    public readonly role: string,
  ) {}
}
