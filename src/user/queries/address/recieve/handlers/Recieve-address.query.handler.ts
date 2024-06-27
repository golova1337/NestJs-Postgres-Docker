import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RecieveAddressQuery } from '../Recieve-address.query';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { AddressRepository } from 'src/user/repository/address-repository';
import { UserAddress } from 'src/user/entities/address.entity';

@QueryHandler(RecieveAddressQuery)
export class RecieveAddressQueryHandler
  implements IQueryHandler<RecieveAddressQuery>
{
  private readonly logger = new EmojiLogger();
  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(
    command: RecieveAddressQuery,
  ): Promise<{ data: UserAddress[] }> {
    const { id } = command;
    const address = await this.addressRepository.recieve(id);

    return {
      data: address,
    };
  }
}
