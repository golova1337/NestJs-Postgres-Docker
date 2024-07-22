import { CreateAddressCommand } from '../../create/handlers/impl/create-address.command';

export class UpdateAddressCommand extends CreateAddressCommand {
  constructor(
    public readonly userId: string,
    public readonly addressId: string,
    public readonly country: string,
    public readonly city: string,
    public readonly street: string,
    public readonly postal_code: string,
    public readonly house: string,
    public readonly apartment?: string,
    public readonly phone?: string,
  ) {
    super(userId, country, city, street, postal_code, house, apartment, phone);
  }
}
