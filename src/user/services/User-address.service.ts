import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAddressUserDto } from '../dto/Create-address.dto';
import { CreateAddressCommand } from '../commands/address/create/impl/Create-address.command';
import { UserAddress } from '../entities/Address.entity';
import { RecieveAddressQuery } from '../queries/address/recieve/impl/Recieve-address.query';
import { UpdateAddressCommand } from '../commands/address/update/impl/Update-address.command';
import { RemoveAddressCommand } from '../commands/address/remove/impl/Remove-address.command';

@Injectable()
export class UserAddressService {
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
    const result: UserAddress = await this.commandBus.execute(
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
    );
    return result;
  }
  async receive(id: string): Promise<UserAddress[]> {
    const result = await this.queryBus.execute(new RecieveAddressQuery(id));
    return result;
  }
  async update(
    createAddressUserDto: CreateAddressUserDto,
    id: string,
    addressId: string,
  ): Promise<void> {
    const { country, city, street, house, apartment, postal_code, phone } =
      createAddressUserDto;
    await this.commandBus.execute(
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
    );
  }
  async remove(id: string, ids: string[]): Promise<void> {
    await this.commandBus.execute(new RemoveAddressCommand(id, ids));
    return;
  }
}
