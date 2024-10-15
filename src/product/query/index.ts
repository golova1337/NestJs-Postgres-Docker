import { FindAllProductsQueryHandler } from './findAll/handlers/find-all.query.handlers';
import { FindOneProductQueryHandler } from './findOne/handlers/find-one-product.query.handler';
import { SearchProductsQueryHandler } from './search/handlers/search.query.handler';

export const ProductQueryHandlers = [
  FindAllProductsQueryHandler,
  FindOneProductQueryHandler,
  SearchProductsQueryHandler,
];
