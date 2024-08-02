import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateItemCommand } from '../impl/update-item.command';
import { ShoppingCartHelper } from 'src/shopping_cart/helpers/shopping-helper';

@CommandHandler(UpdateItemCommand)
export class UpdateItemCommandHAndler
  implements ICommandHandler<UpdateItemCommand>
{
  constructor(private readonly shoppingHelper: ShoppingCartHelper) {}
  async execute(command: UpdateItemCommand): Promise<{
    cart: any[];
    total: number;
  }> {
    const { updateCartItemDto, userId } = command;

    const { sign, quantity, productId } = updateCartItemDto;

    const cacheKey = `cart:${userId}`;

    let cacheCart = await this.shoppingHelper.getCacheCart(cacheKey);
    let product = await this.shoppingHelper.getProduct(productId);

    // check cart
    if (!cacheCart) {
      cacheCart = { cart: [], total: 0 };
    }

    const cart = cacheCart.cart;
    const indexItem = cart.findIndex((item) => item.productId === productId);

    if (indexItem !== -1) {
      switch (sign) {
        case '-':
          this.shoppingHelper.removeQuantity(
            cart,
            indexItem,
            quantity,
            product,
            cacheKey,
          );
          break;
        case '+':
          this.shoppingHelper.addQuantity(cart, indexItem, quantity, product);
          break;

        default:
          break;
      }
    } else if (sign === '+') {
      cart.push(this.shoppingHelper.createItem(productId, quantity, product));
    } else if (sign === '-') return; //if there is not the item and sign = -, we do not create, we can not go negative

    cacheCart.total = await this.shoppingHelper.calculateTotalPrice(cart);

    await this.shoppingHelper.setCacheCart(cacheKey, cacheCart);

    return cacheCart;
  }
}
