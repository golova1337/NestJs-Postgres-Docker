import { OmitType } from '@nestjs/swagger';
import { SingInAuthDto } from './create-auth.dto';

export class SingInAuthAnswerDto extends OmitType(SingInAuthDto, [
  'password',
  'passwordRepeat',
] as const) {}
