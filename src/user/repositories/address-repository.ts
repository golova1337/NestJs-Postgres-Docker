import { Injectable } from '@nestjs/common';
import { Address } from '../entities/address.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UpdateAddressCommand } from '../commands/address/update/impl/update-address.command';

@Injectable()
export class AddressRepository {
  constructor(@InjectModel(Address) private userAddress: typeof Address) {}

  async createAddress(data): Promise<Address> {
    return this.userAddress.create(data);
  }

  async findAllAddress(id: string): Promise<Address[]> {
    return this.userAddress.findAll({ where: { userId: id } });
  }

  async updateAddress(
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

  async findOneAddressById(
    userId: number,
    id: number,
  ): Promise<Address | null> {
    return this.userAddress.findOne({ where: { id: id, userId: userId } });
  }

  async removeAddress(ids: number[], userId: number): Promise<number> {
    return this.userAddress.destroy({
      where: { id: { [Op.in]: ids }, userId: userId },
    });
  }
}
