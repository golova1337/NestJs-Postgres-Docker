import { PickType } from '@nestjs/swagger';
import { SingInAuthDto } from '../../auth/dto/create-auth.dto';

export class RemoveAccountDto extends PickType(SingInAuthDto, [
  'password',
  'passwordRepeat',
] as const) {}
