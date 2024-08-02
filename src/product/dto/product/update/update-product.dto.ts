import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Sign } from 'src/product/enum/sign-enum';
import { CreateProductDto } from '../create/create-product.dto';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(
  PickType(CreateProductDto, [
    'name',
    'category_id',
    'desc',
    'price',
    'files',
  ] as const),
) {
  @ApiProperty()
  @IsOptional()
  @ValidateIf((o) => o.changeQuantity)
  @Transform(({ value }) => value.trim())
  @IsDefined()
  @IsEnum(Sign)
  sign?: Sign;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsInt()
  changeQuantity?: number;
}
