import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsNumberString } from 'class-validator';

export class RemoveProductFilesDto {
  @ApiProperty({ example: ['1', '2'] })
  @IsDefined()
  @IsArray()
  @IsNumberString({ no_symbols: true }, { each: true })
  ids: string[];
}
