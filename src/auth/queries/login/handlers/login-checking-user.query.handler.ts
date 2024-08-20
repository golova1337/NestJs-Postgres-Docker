import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/auth/entities/user.entity';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { LoginCheckingUserQuery } from '../impl/login-checking-user.query';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(LoginCheckingUserQuery)
export class LoginCheckingQueryHandler
  implements IQueryHandler<LoginCheckingUserQuery>
{
  private readonly logger = new EmojiLogger();
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
