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

export class UpdateProductDto extends CreateProductDto {
  @ValidateIf((o) => o.changeQuantity)
  @Transform(({ value }) => value.trim())
  @IsDefined()
  @IsEnum(Sign)
  sign: Sign;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsInt()
  changeQuantity: number;
}
