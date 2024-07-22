import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/auth/entities/user.entity';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { LoginCheckUserQuery } from '../impl/login-check-user.query';

@QueryHandler(LoginCheckUserQuery)
export class LoginQueryHandlear implements IQueryHandler<LoginCheckUserQuery> {
  private readonly logger = new EmojiLogger();
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(query: LoginCheckUserQuery): Promise<User | null> {
    const { registrationMethod, email, phone } = query;
    return await this.authRepository.getUserByRegistrationMethod(
      registrationMethod,
      email,
      phone,
    );
  }
}
