import { RegistrationMethod } from '../../enums/registMethod-enum';

export class LoginCheckUserQuery {
  constructor(
    public readonly registrationMethod: RegistrationMethod,
    public readonly phone: string | undefined,
    public readonly email: string | undefined,
    public readonly password: string | undefined,
  ) {}
}
