import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';

export class LoginCheckingUserQuery {
  constructor(
    public readonly registrationMethod: RegistrationMethod,
    public readonly phone: string | undefined,
    public readonly email: string | undefined,
  ) {}
}
