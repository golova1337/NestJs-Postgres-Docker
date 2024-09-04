import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({ description: 'Product identifier', example: 1 })
  productId: number;

  @ApiProperty({
    description: 'Quantity of the product in the cart',
    example: 1,
  })
  quantity: number;

  @ApiProperty({ description: 'Price per unit of the product', example: 2121 })
  price: number;

  @ApiProperty({
    description: 'Discount percentage on the product, if any',
    example: 39,
    nullable: true,
  })
  discount: number | null;

  @ApiProperty({
    description: 'Price per unit of the product after discount, if any',
    example: 1293.81,
    nullable: true,
  })
  priceWithDiscount: number | null;

  @ApiProperty({
    description:
      'Total price for the product (quantity * price or quantity * priceWithDiscount)',
    example: 7762.86,
  })
  totalPriceForItem: number;
}

export class ShoppingCartDto {
  @ApiProperty({ type: [CartItemDto] })
  cart: CartItemDto[];
  @ApiProperty({ example: 102394 })
  total: number;
}
