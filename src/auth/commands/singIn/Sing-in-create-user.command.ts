import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';

export class SingInCreateUserCommand {
  constructor(
    public readonly registrationMethod: RegistrationMethod,
    public password: string,
    public readonly name?: string,
    public readonly lastname?: string,
    public readonly email?: string,
    public readonly phone?: string,
  ) {}
}
