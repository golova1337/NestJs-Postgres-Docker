import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { User } from '../../../entities/user.entity';
import { AuthRepository } from '../../../repositories/auth.repository';

@ValidatorConstraint({ name: 'isEmailExist', async: true })
@Injectable()
export class LoginByEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(email: string): Promise<boolean> {
    const user: User = await this.authRepository
      .findOneByEmail(email, {
        isVerified: true,
      })
      .catch((error) => {
        throw new InternalServerErrorException('Server Error');
      });

    return !!user;
  }
}

export function LoginByEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: LoginByEmailConstraint,
    });
  };
}
