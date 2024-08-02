import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Address } from 'src/user/entities/Address.entity';
import { AddressRepository } from 'src/user/repositories/address-repository';
import { FindOneAddressByIdQuery } from '../impl/find-one-address-by-id.query';

@QueryHandler(FindOneAddressByIdQuery)
export class FindOneAddressByIdQueryHandler
  implements IQueryHandler<FindOneAddressByIdQuery>
{
  constructor(private readonly addressRepository: AddressRepository) {}
  execute(query: FindOneAddressByIdQuery): Promise<Address | null> {
    const { userId, addressId } = query;
    return this.addressRepository.findOneAddressById(userId, addressId);
  }
}
