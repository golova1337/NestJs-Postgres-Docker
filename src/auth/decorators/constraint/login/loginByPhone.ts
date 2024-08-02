import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator';
import { User } from '../../../entities/user.entity';
import { AuthRepository } from '../../../repositories/auth.repository';

@ValidatorConstraint({ name: 'isNumberExist', async: true })
@Injectable()
export class LoginByPhoneConstraint implements ValidatorConstraintInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(phone: string): Promise<boolean> {
    const user: Partial<User | null> | void = await this.authRepository
      .findOneByPhone(phone, {
        isVerified: true,
      })
      .catch((error) => {
        throw new InternalServerErrorException('Server Error');
      });
    return !!user;
  }
}

export function LoginByPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: LoginByPhoneConstraint,
    });
  };
}
