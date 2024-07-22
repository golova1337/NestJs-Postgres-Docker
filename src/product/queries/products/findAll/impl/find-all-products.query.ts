import {
  PaginationResult,
  PriceResult,
  SortResult,
} from 'src/utils/filtration';

export class FindAllProductsQuery {
  constructor(
    public readonly pagination: PaginationResult,
    public readonly price: PriceResult,
    public readonly order: SortResult,
  ) {}
}
