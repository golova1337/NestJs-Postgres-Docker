import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumberString } from 'class-validator';

export class UpdateProductCategoryDto {
  @ApiProperty({ example: '2' })
  @IsDefined()
  @IsNumberString()
  category_id: string;
}
