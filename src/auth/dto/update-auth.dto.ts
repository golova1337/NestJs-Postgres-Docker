import { PartialType } from '@nestjs/mapped-types';
import { SingInAuthDto } from './create-auth.dto';

export class UpdateUserDto extends PartialType(SingInAuthDto) {}
