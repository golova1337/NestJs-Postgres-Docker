export class CreateOtpCommand {
  constructor(
    public readonly userId: string,
    public readonly otp: string,
  ) {}
}
