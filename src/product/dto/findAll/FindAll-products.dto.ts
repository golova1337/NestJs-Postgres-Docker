import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { Sort } from 'src/common/enum/sort-enum';
import { PerPage } from 'src/common/enum/per-page.enum';
import { SortBy } from 'src/product/enum/sort-by.enum';

export class FindAllQueriesDto {
  @IsOptional()
  @IsEnum(PerPage)
  perPage?: PerPage;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(Sort)
  sort?: Sort;
}
