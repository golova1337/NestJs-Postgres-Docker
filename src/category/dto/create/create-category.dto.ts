import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: false, example: 't-shirt' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    required: false,
    example:
      'Discover our versatile collection of T-Shirts, crafted for ultimate comfort and style. Our T-Shirts range from classic basics to trendy designs, suitable for any occasion. Made with high-quality materials, they provide a perfect fit and lasting durability. Whether you prefer solid colors, graphic prints, or unique patterns, our selection has something for everyone. Ideal for casual outings, workouts, or as a base layer, these T-Shirts are a must-have in every wardrobe. Explore our range to find your perfect match and elevate your everyday look.',
  })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @Length(2, 65535)
  desc: string;
}
