import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../../entities/User.entity';
import { AuthRepository } from '../../../repositories/Auth.repository';

@ValidatorConstraint({ name: 'isPhoneExist', async: true })
@Injectable()
export class SingInByPhoneConstraint implements ValidatorConstraintInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(number: string): Promise<boolean> {
    const user: User = await this.authRepository.findOneByPhone(number);
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Bad Request';
  }
}
