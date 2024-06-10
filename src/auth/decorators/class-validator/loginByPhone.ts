import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../entities/user.entity';
import { AuthRepository } from '../../repository/user-repository';

@ValidatorConstraint({ name: 'isNumberExist', async: true })
@Injectable()
export class LoginByPhoneConstraint implements ValidatorConstraintInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(numbers: string): Promise<boolean> {
    const user: Partial<User | null> | void = await this.authRepository
      .findOneByPhone(numbers, {
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
