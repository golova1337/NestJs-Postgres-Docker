import { CreateOrderCommandHandler } from './create/handlers/create-order.handler';
import { UpdateOrderCommandHandler } from './update/handlers/update-order.handler';

export const Commands = [CreateOrderCommandHandler, UpdateOrderCommandHandler];
