import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddressRepository } from 'src/user/repositories/address-repository';
import { UpdateAddressCommand } from '../impl/update-address.command';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressCommandHandler
  implements ICommandHandler<UpdateAddressCommand>
{
  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(
    command: UpdateAddressCommand,
  ): Promise<[affectedCount: number]> {
    const { userId, addressId, ...data } = command;
    let condition: any = {};
    condition.userId = userId;
    condition.addressId = addressId;
    return this.addressRepository.updateAddress(condition, data);
  }
}
