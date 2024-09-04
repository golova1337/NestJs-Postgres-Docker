import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { CreateAddressCommand } from '../commands/address/create/handlers/impl/create-address.command';
import { RemoveAddressCommand } from '../commands/address/remove/impl/remove-address.command';
import { UpdateAddressCommand } from '../commands/address/update/impl/update-address.command';
import { CreateAddressUserDto } from '../dto/create/create-address.dto';
import { Address } from '../entities/Address.entity';
import { FindAllAddressQuery } from '../queries/address/findAllAddress/impl/recieve-address.query';
import { FindOneAddressByIdQuery } from '../queries/address/findOneAddressById/impl/find-one-address-by-id.query';

@Injectable()
export class UserAddressService {
  logger = new EmojiLogger();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createAddress(
    createAddressUserDto: CreateAddressUserDto,
    id: string,
  ): Promise<Address> {
    const { country, city, street, house, apartment, postal_code, phone } =
      createAddressUserDto;
    return this.commandBus
      .execute(
        new CreateAddressCommand(
          id,
          country,
          city,
          street,
          postal_code,
          house,
          apartment,
          phone,
        ),
      )
      .catch((error) => {
        this.logger.error(`newAddress ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findAllAddress(id: string): Promise<Address[]> {
    return this.queryBus.execute(new FindAllAddressQuery(id)).catch((error) => {
      this.logger.error(`Get All Addresses Query ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async updateAddress(
    newAddressData: CreateAddressUserDto,
    id: string,
    addressId: string,
  ): Promise<[affectedCount: number]> {
    const { country, city, street, house, apartment, postal_code, phone } =
      newAddressData;
    return this.commandBus
      .execute(
        new UpdateAddressCommand(
          id,
          addressId,
          country,
          city,
          street,
          postal_code,
          house,
          apartment,
          phone,
        ),
      )
      .catch((error) => {
        this.logger.error(`Update Address Command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findOneAddressById(
    addressId: number,
    id: number,
  ): Promise<Address | null> {
    return this.queryBus
      .execute(new FindOneAddressByIdQuery(id, addressId))
      .catch((error) => {
        this.logger.error(`Find One Address by id Command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async removeAddress(id: number, ids: number[]): Promise<number> {
    return await this.commandBus
      .execute(new RemoveAddressCommand(id, ids))
      .catch((error) => {
        this.logger.error(`Remove  Address Command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }
}
