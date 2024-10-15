import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../../entities/user.entity';
import { AuthRepository } from '../../../repositories/auth.repository';
import { LoginCheckingUserQuery } from '../impl/login-checking-user.query';

@QueryHandler(LoginCheckingUserQuery)
export class LoginCheckingQueryHandler
  implements IQueryHandler<LoginCheckingUserQuery>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(query: LoginCheckingUserQuery): Promise<User | null> {
    const { registrationMethod, email, phone } = query;
    const user = await this.authRepository.getUserByRegistrationMethod(
      registrationMethod,
      email,
      phone,
    );
    if (!user) throw new BadRequestException('Bad Request');

    return user;
  }
}
