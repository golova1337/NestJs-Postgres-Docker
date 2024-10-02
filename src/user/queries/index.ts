import { FindAllAddressQueryHandler } from './address/findAllAddress/handlers/recieve-address.query.handler';
import { FindOneAddressByIdQueryHandler } from './address/findOneAddressById/handlers/find-one-address-by-id.query.handler';

export const QueryHandlers = [
  FindAllAddressQueryHandler,
  FindOneAddressByIdQueryHandler,
];
