import { CreateCartItemDto } from 'src/shopping_cart/dto/create-shopping_cart.dto';

export class AddItemCommand {
  constructor(
    public readonly createCartItemDto: CreateCartItemDto,
    public readonly userId: number,
  ) {}
}
