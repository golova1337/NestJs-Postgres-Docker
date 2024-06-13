import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../../entities/user.entity';
import { AuthRepository } from '../../../repository/auth-repository';

@ValidatorConstraint({ name: 'isNumberExist', async: true })
@Injectable()
export class RepeatSendCodeByPhoneConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(numbers: string): Promise<boolean> {
    const user: User | null = await this.authRepository
      .findOneByPhone(numbers, {
        isVerified: false,
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
