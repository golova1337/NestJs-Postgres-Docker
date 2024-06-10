import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../entities/user.entity';
import { AuthRepository } from '../../repository/user-repository';

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
