import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repository/user-repository';
import { User } from 'src/auth/entities/User.entity';
import { UpdateEmailDto } from '../dto/update-email';

@Injectable()
export class UserService {
  private readonly logger = new EmojiLogger();
  constructor(private readonly userRepository: UserRepository) {}

  async updateEmail(id: number, updateEmailDto: UpdateEmailDto): Promise<void> {
    await this.userRepository.updateEmail(updateEmailDto, id).catch((error) => {
      this.logger.error(`affectedCount ${error}`);
      throw new InternalServerErrorException('Server Error');
    });

    return;
  }

  async removeAccount(id: number, password: string): Promise<void> {
    const user: User = await this.userRepository.finbByPk(id).catch((error) => {
      this.logger.error(`user: ${error}`);
      throw new InternalServerErrorException('Server Error');
    });

    const compare: boolean = await bcrypt
      .compare(password, user?.password)
      .catch((error) => {
        this.logger.error(`compare: ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    if (!compare) throw new BadRequestException('Password is incorect');

    await this.userRepository.removeAccount(id).catch((error) => {
      this.logger.error(`remove: ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }
}
