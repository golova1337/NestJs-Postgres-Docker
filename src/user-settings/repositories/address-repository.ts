import { Injectable } from '@nestjs/common';
import { UserAddress } from '../entities/Address.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UpdateAddressCommand } from '../commands/address/update/impl/Update-address.command';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectModel(UserAddress) private userAddress: typeof UserAddress,
  ) {}

  async create(data): Promise<UserAddress> {
    return this.userAddress.create(data);
  }
  async recieve(id: string): Promise<UserAddress[]> {
    return this.userAddress.findAll({ where: { userId: id } });
  }

  async update(
    condition: {
      userId: string;
      addressId: string;
    },
    data: Omit<UpdateAddressCommand, 'userId' | 'addressId'>,
  ): Promise<[affectedCount: number]> {

    return this.userAddress.update(data, {
      where: { id: condition.addressId, userId: condition.userId },
    });
  }

  async remove(data: { idsAddress: string[]; userId: string }) {
    return this.userAddress.destroy({
      where: { id: { [Op.in]: data.idsAddress }, userId: data.userId },
    });
  }
}
