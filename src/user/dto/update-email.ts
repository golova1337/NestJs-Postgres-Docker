import { PickType } from '@nestjs/swagger';
import { SingInAuthDto } from 'src/auth/dto/create-auth.dto';

export class UpdateEmailDto extends PickType(SingInAuthDto, [
  'email',
] as const) {}
