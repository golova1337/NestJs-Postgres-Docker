import { PerPage } from 'src/common/enum/per-page.enum';
import { Sort } from 'src/common/enum/sort-enum';
import { SortBy } from 'src/product/enum/sort-by.enum';

export interface PaginationResult {
  page: number;
  perPage: PerPage;
  offset: number;
}

export interface PriceResult {
  minPrice: number;
  maxPrice: number;
}

export interface SortResult {
  sort: Sort;
  sortBy: SortBy;
}

export class FiltrationUtils {
  static pagination(page: number, perPage: PerPage): PaginationResult {
    const parsedPage = page !== undefined ? page : 1;
    const parsedPerPage = perPage !== undefined ? perPage : PerPage.Ten;
    const offset = (parsedPage - 1) * parsedPerPage;

    return { page: parsedPage, perPage: parsedPerPage, offset };
  }
}
