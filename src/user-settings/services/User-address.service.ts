import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAddressUserDto } from '../dto/create/Create-address.dto';
import { CreateAddressCommand } from '../commands/address/create/impl/Create-address.command';
import { UserAddress } from '../entities/Address.entity';
import { RecieveAddressQuery } from '../queries/address/recieve/impl/Recieve-address.query';
import { UpdateAddressCommand } from '../commands/address/update/impl/Update-address.command';
import { RemoveAddressCommand } from '../commands/address/remove/impl/Remove-address.command';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@Injectable()
export class UserAddressService {
  logger = new EmojiLogger();
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async create(
    createAddressUserDto: CreateAddressUserDto,
    id: string,
  ): Promise<UserAddress> {
    const { country, city, street, house, apartment, postal_code, phone } =
      createAddressUserDto;
    const result: UserAddress = await this.commandBus
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
    return result;
  }
  async receive(id: string): Promise<UserAddress[]> {
    const result: UserAddress[] = await this.queryBus
      .execute(new RecieveAddressQuery(id))
      .catch((error) => {
        this.logger.error(`Recieve Address Query ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return result;
  }
  async update(
    createAddressUserDto: CreateAddressUserDto,
    id: string,
    addressId: string,
  ): Promise<void> {
    const { country, city, street, house, apartment, postal_code, phone } =
      createAddressUserDto;
    await this.commandBus
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
  async remove(id: string, ids: string[]): Promise<void> {
    await this.commandBus
      .execute(new RemoveAddressCommand(id, ids))
      .catch((error) => {
        this.logger.error(`Remove  Address Command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return;
  }
}
