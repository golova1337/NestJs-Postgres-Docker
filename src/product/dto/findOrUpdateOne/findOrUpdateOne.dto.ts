import { Transform } from 'class-transformer';
import { IsDefined, IsInt } from 'class-validator';
import { ProductExists } from 'src/product/decorators/constraint/product-exists';

export class FindOneDto {
  @IsDefined()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @ProductExists({ message: 'The product does not exist' })
  id: number;
}
