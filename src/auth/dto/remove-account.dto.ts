import { PickType } from '@nestjs/mapped-types';
import { SingInAuthDto } from './create-auth.dto';

export class RemoveAccountDto extends PickType(SingInAuthDto, [
  'password',
  'passwordRepeat',
] as const) {}
