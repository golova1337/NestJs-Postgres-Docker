import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginCheckingUserQuery } from '../impl/login-checking-user.query';
import { BadRequestException } from '@nestjs/common';
import { EmojiLogger } from '../../../../common/logger/emojiLogger';
import { AuthRepository } from '../../../repositories/auth.repository';
import { User } from '../../../entities/user.entity';

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
