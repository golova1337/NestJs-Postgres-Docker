import { ApiProperty } from '@nestjs/swagger';

export class CreatedCategoryDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the product',
    example: 't-shirt',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example:
      'Discover our versatile collection of T-Shirts, crafted for ultimate comfort and style. Our T-Shirts range from classic basics to trendy designs, suitable for any occasion. Made with high-quality materials, they provide a perfect fit and lasting durability. Whether you prefer solid colors, graphic prints, or unique patterns, our selection has something for everyone. Ideal for casual outings, workouts, or as a base layer, these T-Shirts are a must-have in every wardrobe. Explore our range to find your perfect match and elevate your everyday look.',
  })
  desc: string;

  @ApiProperty({
    description: 'Timestamp of when the product was created',
    example: '2024-07-08T11:08:04.848Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp of the last update to the product',
    example: '2024-07-08T11:08:04.848Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Timestamp of when the product was deleted',
    example: null,
  })
  deletedAt: string | null;
}
