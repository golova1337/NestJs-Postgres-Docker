import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveItemCommand } from '../impl/remove-item.command';
import { ShoppingCartHelper } from 'src/shopping_cart/helpers/shopping-helpers';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(RemoveItemCommand)
export class RemoveItemCommandHandler
  implements ICommandHandler<RemoveItemCommand>
{
  constructor(private readonly shoppingHelper: ShoppingCartHelper) {}
  async execute(command: RemoveItemCommand): Promise<{
    cart: any[];
    total: number;
  }> {
    const { itemId, userId } = command;
    // create chache key
    const cacheKey = `cart:${userId}`;

    // get cart
    let cacheCart = await this.shoppingHelper.getCacheCart(cacheKey);

    // check
    if (!cacheCart) throw new BadRequestException('Bad Request');

    let cart = cacheCart.cart;
    // get index item
    const indexItem = cart.findIndex((i) => i['productId'] == itemId);

    // item does not exist
    if (indexItem === -1) return cacheCart;

    //  item exists , we remove item
    cart.splice(indexItem, 1);

    // if cart is empty we remove cart
    if (cart.length === 0) {
      await this.shoppingHelper.delCacheCart(cacheKey);
      return;
    }

    // total price for a particular cart by each item
    cacheCart.total = await this.shoppingHelper.calculateTotalPrice(cart);

    await this.shoppingHelper.setCacheCart(cacheKey, cacheCart);
    return cacheCart;
  }
}
