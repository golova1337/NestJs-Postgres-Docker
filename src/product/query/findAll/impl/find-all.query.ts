import { FindAllQueriesDto } from 'src/product/dto/findAll/findAll-products.dto';

export class FindAllProductsQuery {
  constructor(public readonly filtration: FindAllQueriesDto) {}
}
