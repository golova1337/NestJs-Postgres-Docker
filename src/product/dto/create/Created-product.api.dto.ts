import { ApiProperty } from '@nestjs/swagger';

export class CreatedProductDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the product',
    example: 'carharttsss',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'style',
  })
  desc: string;

  @ApiProperty({
    description: 'Stock Keeping Unit identifier',
    example: 'CG121XL',
  })
  SKU: string;

  @ApiProperty({
    description: 'Identifier for the category to which the product belongs',
    example: 1,
  })
  category_id: number;

  @ApiProperty({
    description: 'Identifier for the inventory associated with the product',
    example: 1,
  })
  inventory_id: number;

  @ApiProperty({
    description: 'Identifier for the discount associated with the product',
    example: null,
  })
  discount_id: number | null;

  @ApiProperty({
    description: 'Price of the product',
    example: '45.00',
  })
  price: string;

  @ApiProperty({
    description: 'Timestamp of when the product was created',
    example: '2024-07-05T09:08:05.741Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp of the last update to the product',
    example: '2024-07-05T09:08:05.741Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Timestamp of when the product was deleted',
    example: null,
  })
  deletedAt: string | null;
}
