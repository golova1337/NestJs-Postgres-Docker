import { Injectable } from '@nestjs/common';
import { UserAddress } from '../entities/address.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAddressUserDto } from '../dto/create-address.dto';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectModel(UserAddress) private userAddress: typeof UserAddress,
  ) {}

  async create(data): Promise<UserAddress> {
    return this.userAddress.create(data);
  }

  async update(data: {
    id: number;
    addressId: number;
    updateAddress: CreateAddressUserDto;
  }): Promise<[affectedCount: number]> {
    return this.userAddress.update(data.updateAddress, {
      where: { id: data.addressId, userId: data.id },
    });
  }
}
