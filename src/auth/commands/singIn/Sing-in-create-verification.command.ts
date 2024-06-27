import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';

export class SingInCreateOtpCommand {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly registrationMethod: RegistrationMethod,
  ) {}
}
