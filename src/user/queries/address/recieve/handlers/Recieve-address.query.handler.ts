import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RecieveAddressQuery } from '../impl/Recieve-address.query';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { AddressRepository } from 'src/user/repository/Address-repository';
import { UserAddress } from 'src/user/entities/Address.entity';

@QueryHandler(RecieveAddressQuery)
export class RecieveAddressQueryHandler
  implements IQueryHandler<RecieveAddressQuery>
{
  private readonly logger = new EmojiLogger();
  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(
    command: RecieveAddressQuery,
  ): Promise<{ addresses: UserAddress[] }> {
    const { id } = command;
    const address = await this.addressRepository.recieve(id);

    return {
      addresses: address,
    };
  }
}
