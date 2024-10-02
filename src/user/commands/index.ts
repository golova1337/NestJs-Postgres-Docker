import { CreateAddressCommandHandler } from './address/create/create-address.command.handler';
import { RemoveAddressCommandHandler } from './address/remove/handlers/remove-address.command.handler';
import { UpdateAddressCommandHandler } from './address/update/handler/update-address.command.handler';

export const CommandHandlers = [
  CreateAddressCommandHandler,
  UpdateAddressCommandHandler,
  RemoveAddressCommandHandler,
];
