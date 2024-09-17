import { SingInAuthUserDto } from 'src/auth/dto/create/create-auth.dto';
import { Roles } from 'src/auth/enums/roles-enum';

export class AdminCreationCommand {
  constructor(
    public readonly singInAuthDto: SingInAuthUserDto & { role: Roles.Admin },
  ) {}
}
