import { UpdateItemDto } from 'src/shopping_cart/dto/update-shopping_cart.dto';

export class UpdateItemCommand {
  constructor(
    public readonly userId: number,
    public readonly updateCartItemDto: UpdateItemDto,
  ) {}
}
