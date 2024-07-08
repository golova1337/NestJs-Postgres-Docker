import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserAddress } from 'src/user/entities/Address.entity';
import { AddressRepository } from 'src/user/repository/Address-repository';
import { CreateAddressCommand } from '../impl/Create-address.command';

@CommandHandler(CreateAddressCommand)
export class CreateAddressCommandHandler
  implements ICommandHandler<CreateAddressCommand>
{
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(command: CreateAddressCommand): Promise<UserAddress> {
    return await this.addressRepository.create(command);
  }
}
