import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddressRepository } from '../repository/address-repository';
import { UserAddress } from '../entities/address.entity';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { CreateAddressUserDto } from '../dto/create-address.dto';

@Injectable()
export class AddressService {
  private readonly logger = new EmojiLogger();
  constructor(private readonly addressRepository: AddressRepository) {}
  async createAddress(
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
  async updateAddress(data: {
    id: number;
    addressId: number;
    updateAddress: CreateAddressUserDto;
  }): Promise<void> {
    await this.addressRepository.update(data).catch((error) => {
      this.logger.error(`affectedCount ${error}`);
      throw new InternalServerErrorException('Server Error');
    });

    return;
  }

  async remove(data: { ids: string[]; userId: string }): Promise<void> {
    await this.addressRepository.remove(data).catch((error) => {
      this.logger.error(`Remove account ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }
}
