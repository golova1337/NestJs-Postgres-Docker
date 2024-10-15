import { SingInAuthUserDto } from 'src/auth/dto/create/create-auth.dto';

export class UserCreationCommand {
  constructor(public readonly singInAuthDto: SingInAuthUserDto) {}
}
