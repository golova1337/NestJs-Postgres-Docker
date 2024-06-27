import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAddressCommand } from '../Update-address.command';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { InternalServerErrorException } from '@nestjs/common';
import { AddressRepository } from 'src/user/repository/address-repository';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressCommandHandler
  implements ICommandHandler<UpdateAddressCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(command: UpdateAddressCommand): Promise<void> {
    const { userId, addressId, ...data } = command;
    let condition: any = {};
    condition.userId = userId;
    condition.addressId = addressId;
    await this.addressRepository.update(condition, data).catch((error) => {
      this.logger.error(`affectedCount ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }
}
