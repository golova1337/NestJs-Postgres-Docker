import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/auth/entities/User.entity';
import { LoginCheckUserQuery } from 'src/auth/queries/login/Login-check-user.query';
import { AuthRepository } from 'src/auth/repository/Auth.repository';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import * as bcrypt from 'bcrypt';

@QueryHandler(LoginCheckUserQuery)
export class LoginQueryHandlear implements IQueryHandler<LoginCheckUserQuery> {
  private readonly logger = new EmojiLogger();
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(query: LoginCheckUserQuery): Promise<User> {
    const { registrationMethod, email, phone, password } = query;
    try {
      const user = await this.authRepository.getUserByRegistrationMethod(
        registrationMethod,
        email,
        phone,
      );

      if (!user) {
        throw new BadRequestException('Bad Request');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequestException('Bad Request');
      return user;
    } catch (error) {
      this.logger.error(`Login Check user: ${error}`);

      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
