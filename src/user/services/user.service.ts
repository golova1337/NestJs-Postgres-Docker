import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repository/user-repository';
import { User } from 'src/auth/entities/user.entity';
import { AddressRepository } from '../repository/address-repository';
import { UserAddress } from '../entities/address.entity';
import { UpdateEmailDto } from '../dto/update-email';
import { CreateAddressUserDto } from '../dto/create-address.dto';

@Injectable()
export class UserService {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  async create(
    id: number,
    address: CreateAddressUserDto,
  ): Promise<{ data: UserAddress }> {
    const newAddress: UserAddress = await this.addressRepository
      .create({
        userId: id,
        ...address,
      })
      .catch((error) => {
        this.logger.error(`newAddress ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return {
      data: newAddress,
    };
  }
  async updateEmail(
    id: number,
    updateEmailDto: UpdateEmailDto,
  ): Promise<{ data: { affectedCount: [affectedCount: number] } }> {
    const affectedCount = await this.userRepository
      .updateEmail(updateEmailDto, id)
      .catch((error) => {
        this.logger.error(`affectedCount ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    return {
      data: { affectedCount },
    };
  }

  async updateAddress(data: {
    id: number;
    addressId: number;
    updateAddress: CreateAddressUserDto;
  }): Promise<{ data: { affectedCount: [affectedCount: number] } }> {
    const affectedCount: [affectedCount: number] = await this.addressRepository
      .update(data)
      .catch((error) => {
        this.logger.error(`affectedCount ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    return {
      data: {
        affectedCount,
      },
    };
  }

  async remove(id: number, password: string): Promise<void> {
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

    await this.userRepository.remove(id).catch((error) => {
      this.logger.error(`remove: ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }
}
