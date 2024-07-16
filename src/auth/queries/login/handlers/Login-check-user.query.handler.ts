import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/auth/entities/User.entity';
import { AuthRepository } from 'src/auth/repositories/Auth.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { LoginCheckUserQuery } from '../impl/Login-check-user.query';

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
