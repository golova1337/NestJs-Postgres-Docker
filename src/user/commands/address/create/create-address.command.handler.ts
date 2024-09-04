import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Address } from 'src/user/entities/address.entity';
import { AddressRepository } from 'src/user/repositories/address-repository';
import { CreateAddressCommand } from './handlers/impl/create-address.command';

@CommandHandler(CreateAddressCommand)
export class CreateAddressCommandHandler
  implements ICommandHandler<CreateAddressCommand>
{
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(command: CreateAddressCommand): Promise<Address> {
    return await this.addressRepository.createAddress(command);
  }
}
