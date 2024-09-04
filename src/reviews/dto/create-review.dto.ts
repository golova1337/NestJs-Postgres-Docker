import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @Length(10, 250)
  @IsOptional()
  @IsString()
  comment: string;
}
