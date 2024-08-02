import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator';
import { User } from '../../../entities/user.entity';
import { AuthRepository } from '../../../repositories/auth.repository';

@ValidatorConstraint({ name: 'isPhoneExist', async: true })
@Injectable()
export class SingInByPhoneConstraint implements ValidatorConstraintInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(number: string): Promise<boolean> {
    const user: User = await this.authRepository.findOneByPhone(number);
    return !user;
  }
}

export function SingInByPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SingInByPhoneConstraint,
    });
  };
}
