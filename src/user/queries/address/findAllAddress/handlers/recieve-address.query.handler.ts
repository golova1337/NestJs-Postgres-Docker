import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Address } from 'src/user/entities/address.entity';
import { AddressRepository } from 'src/user/repositories/address-repository';
import { FindAllAddressQuery } from '../impl/recieve-address.query';

@QueryHandler(FindAllAddressQuery)
export class FindAllAddressQueryHandler
  implements IQueryHandler<FindAllAddressQuery>
{
  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(command: FindAllAddressQuery): Promise<Address[]> {
    const { id } = command;
    return this.addressRepository.findAllAddress(id);
  }
}
