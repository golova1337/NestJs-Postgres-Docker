import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../../entities/User.entity';
import { AuthRepository } from '../../../repositories/Auth.repository';

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

  defaultMessage(args: ValidationArguments) {
    return 'Bad Request';
  }
}
