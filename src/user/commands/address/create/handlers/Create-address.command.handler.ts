import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { UserAddress } from 'src/user/entities/Address.entity';
import { AddressRepository } from 'src/user/repository/Address-repository';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateAddressCommand } from '../impl/Create-address.command';

@CommandHandler(CreateAddressCommand)
export class CreateAddressCommandHandler
  implements ICommandHandler<CreateAddressCommand>
{
  private readonly logger = new EmojiLogger();
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(command: CreateAddressCommand): Promise<UserAddress> {
    const newAddress: UserAddress = await this.addressRepository
      .create(command)
      .catch((error) => {
        this.logger.error(`newAddress ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return newAddress;
  }
}
