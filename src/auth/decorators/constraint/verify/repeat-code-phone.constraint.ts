import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { User } from '../../../entities/user.entity';
import { AuthRepository } from '../../../repositories/auth.repository';

@ValidatorConstraint({ name: 'isNumberExist', async: true })
@Injectable()
export class RepeatSendOtpByPhoneConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(phone: string): Promise<boolean> {
    const user: User | null = await this.authRepository
      .findOneByPhone(phone, {
        isVerified: false,
      })
      .catch((error) => {
        throw new InternalServerErrorException('Server Error');
      });

    return !!user;
  }
}

export function RepeatSendOtpByPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: RepeatSendOtpByPhoneConstraint,
    });
  };
}
