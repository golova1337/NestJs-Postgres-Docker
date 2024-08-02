import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAddressCommand } from '../impl/remove-address.command';
import { AddressRepository } from 'src/user/repositories/address-repository';

@CommandHandler(RemoveAddressCommand)
export class RemoveAddressCommandHandler
  implements ICommandHandler<RemoveAddressCommand>
{
  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(command: RemoveAddressCommand): Promise<number> {
    const { ids, userId } = command;
    return this.addressRepository.removeAddress(ids, userId);
  }
}
