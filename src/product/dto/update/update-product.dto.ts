import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { Sign } from 'src/product/enum/sign-enum';
import { CreateProductDto } from '../create/create-product.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['quantity'] as const),
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

  @ApiProperty({ example: '1' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  @IsInt()
  discount_id?: number;
}
