import { FindAllQueriesDto } from 'src/product/dto/product/findAll/findAll-products.dto';

export class FindAllCommand {
  constructor(public readonly filtration: FindAllQueriesDto) {}
}
