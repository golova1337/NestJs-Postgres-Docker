import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';

export class LoginCheckUserQuery {
  constructor(
    public readonly registrationMethod: RegistrationMethod,
    public readonly phone: string | undefined,
    public readonly email: string | undefined,
  ) {}
}
