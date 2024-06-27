import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../../entities/User.entity';
import { AuthRepository } from '../../../repository/Auth.repository';

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

  defaultMessage(args: ValidationArguments) {
    return 'Bad Request';
  }
}
