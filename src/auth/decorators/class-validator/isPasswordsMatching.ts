import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SingInAuthDto } from '../../dto/create-auth.dto';

@ValidatorConstraint({ name: 'isPasswordsMatching', async: false })
@Injectable()
export class IsPasswordsMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(passwordRepeat: string, args: ValidationArguments): boolean {
    const obj = args.object as SingInAuthDto;
    return obj.password === obj.passwordRepeat;
  }

  defaultMessage(args: ValidationArguments) {
    return `The Passwords doesn't match`;
  }
}
