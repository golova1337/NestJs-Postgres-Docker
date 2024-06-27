import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAddressCommand } from '../Remove-address.command';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { AddressRepository } from 'src/user/repository/address-repository';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(RemoveAddressCommand)
export class RemoveAddressCommandHandler
  implements ICommandHandler<RemoveAddressCommand>
{
  private readonly logger = new EmojiLogger();

  constructor(private readonly addressRepository: AddressRepository) {}
  async execute(command: RemoveAddressCommand): Promise<void> {
    await this.addressRepository.remove(command).catch((error) => {
      this.logger.error(`Remove account ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }
}
