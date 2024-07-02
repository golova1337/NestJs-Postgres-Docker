import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddressRepository } from 'src/user/repository/Address-repository';
import { UpdateAddressCommand } from '../impl/Update-address.command';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressCommandHandler
  implements ICommandHandler<UpdateAddressCommand>
{
  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(command: UpdateAddressCommand): Promise<void> {
    const { userId, addressId, ...data } = command;
    let condition: any = {};
    condition.userId = userId;
    condition.addressId = addressId;
    await this.addressRepository.update(condition, data);
    return;
  }
}
