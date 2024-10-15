import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { PerPage } from 'src/common/enum/per-page.enum';
import { Sort } from 'src/common/enum/sort-enum';
import { SortBy } from 'src/product/enum/sort-by.enum';

export class FindAllQueriesDto {
  @IsOptional()
  @IsEnum(PerPage)
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  perPage?: PerPage;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumberString()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  minPrice?: number;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  maxPrice?: number;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(Sort)
  sort?: Sort;
}
