import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { SingInAuthDto } from 'src/auth/dto/create/create-auth.dto';

@ValidatorConstraint({ name: 'isPasswordsMatching', async: false })
@Injectable()
export class IsPasswordsMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(passwordRepeat: string, args: ValidationArguments): boolean {
    const obj = args.object as SingInAuthDto;
    return obj.password === obj.passwordRepeat;
  }
}

export function IsPasswordsMatching(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordsMatchingConstraint,
    });
  };
}
