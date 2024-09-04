import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';

export class DeleteDiscountDto {
  @ApiProperty()
  @Transform(({ value }) => value.map((i) => parseFloat(i)))
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
