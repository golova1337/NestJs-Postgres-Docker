export class MakeUserVerified {
  constructor(
    public readonly verificationCode: string,
    public readonly id: string,
  ) {}
}
