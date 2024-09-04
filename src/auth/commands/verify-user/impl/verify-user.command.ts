export class VerifyUserCommand {
  constructor(
    public readonly verificationCode: string,
    public readonly id: number,
  ) {}
}
