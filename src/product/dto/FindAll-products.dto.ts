import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { Sort } from 'src/common/enum/sort-enum';
import { SortBy } from '../enum/sort-by.enum';
import { PerPage } from 'src/common/enum/per-page.enum';

export class FindAllDto {
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
