import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddressRepository } from 'src/user/repository/Address-repository';
import { RemoveAddressCommand } from '../impl/Remove-address.command';

@CommandHandler(RemoveAddressCommand)
export class RemoveAddressCommandHandler
  implements ICommandHandler<RemoveAddressCommand>
{
  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(command: RemoveAddressCommand): Promise<void> {
    await this.addressRepository.remove(command);
    return;
  }
}
