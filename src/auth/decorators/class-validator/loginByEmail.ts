import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../entities/user.entity';
import { AuthRepository } from '../../repository/user-repository';

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

  defaultMessage(args: ValidationArguments) {
    return 'Bad Request';
  }
}
