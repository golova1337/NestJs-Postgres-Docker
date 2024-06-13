import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../../entities/user.entity';
import { AuthRepository } from '../../../repository/auth-repository';

@ValidatorConstraint({ name: 'isEmailExist', async: true })
@Injectable()
export class SingInByEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(email: string): Promise<boolean> {
    const user: User = await this.authRepository.findOneByEmail(email);

    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Bad Request';
  }
}
