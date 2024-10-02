import { AddItemCommandHandler } from './addItem/handlers/add-item.command.handler';
import { RemoveItemCommandHandler } from './addItem/removeItem/handlers/remove-item,command.handler';
import { UpdateItemCommandHAndler } from './updateItem/handlers/update-item.command.handler';

export const Commands = [
  AddItemCommandHandler,
  UpdateItemCommandHAndler,
  RemoveItemCommandHandler,
];
