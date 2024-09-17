import { FindAllQueriesDto } from 'src/product/dto/product/findAll/findAll-products.dto';

export class FindAllProductsQuery {
  constructor(public readonly filtration: FindAllQueriesDto) {}
}
