export class CreateAddressCommand {
  constructor(
    public readonly userId: string,
    public readonly country: string,
    public readonly city: string,
    public readonly street: string,
    public readonly postal_code: string,
    public readonly house: string,
    public readonly apartment?: string,
    public readonly phone?: string,
  ) {}
}
