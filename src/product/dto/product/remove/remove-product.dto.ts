import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDefined, IsInt } from 'class-validator';

export class RemoveProductsDto {
  @ApiProperty({ example: ['1'] })
  @IsDefined()
  @IsArray()
  @Transform(({ value }) => value.map((item) => parseInt(item, 10)))
  @IsInt({ each: true })
  ids: number[];
}
