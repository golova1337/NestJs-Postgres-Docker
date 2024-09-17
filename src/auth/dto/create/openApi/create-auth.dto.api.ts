import { OmitType } from '@nestjs/swagger';
import { SingInAuthUserDto } from '../create-auth.dto';

export class SingInAuthAnswerDto extends OmitType(SingInAuthUserDto, [
  'password',
  'passwordRepeat',
] as const) {}
