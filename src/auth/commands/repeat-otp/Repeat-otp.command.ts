import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';

export class RepeatSendOtpCommand {
  constructor(
    public readonly registrationMethod: RegistrationMethod,
    public readonly email: string,
    public readonly phone: string,
  ) {}
}
