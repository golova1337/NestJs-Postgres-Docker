import { ApiProperty } from '@nestjs/swagger';

export class DiscountApiDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the sale',
  })
  id: number;

  @ApiProperty({
    example: 'summer',
    description: 'The name of the sale event',
  })
  name: string;

  @ApiProperty({
    example:
      'Get ready to embrace the sunshine with our exclusive Summer Spectacular Sale! Dive into amazing discounts and unbeatable offers on a wide range of products.',
    description: 'The description of the sale event',
  })
  disc: string;

  @ApiProperty({
    example: '33.33',
    description: 'The discount percentage for the sale',
  })
  discount_percent: string;

  @ApiProperty({
    example: '2024-07-30T08:58:00.944Z',
    description: 'The date and time when the sale was last updated',
  })
  updatedAt: string;

  @ApiProperty({
    example: '2024-07-30T08:58:00.944Z',
    description: 'The date and time when the sale was created',
  })
  createdAt: string;

  @ApiProperty({
    example: null,
    description: 'The date and time when the sale was deleted, if applicable',
    nullable: true,
  })
  deletedAt: string | null;
}
