import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveItemCommand } from '../impl/remove-item.command';
import { ShoppingCartHelper } from 'src/shopping_cart/helpers/shopping-helpers';
import { BadRequestException } from '@nestjs/common';
import { CashManagerService } from 'src/infrastructure/cash-manager/cash-manager.service';

@CommandHandler(RemoveItemCommand)
export class RemoveItemCommandHandler
  implements ICommandHandler<RemoveItemCommand>
{
  constructor(
    private readonly shoppingHelper: ShoppingCartHelper,
    private readonly cashManagerService: CashManagerService,
  ) {}
  async execute(command: RemoveItemCommand): Promise<{
    cart: any[];
    total: number;
  }> {
    const { itemId, userId } = command;
    // create chache key
    const cacheKey = `cart:${userId}`;

    // get cart
    let cacheCart = await this.cashManagerService.get(cacheKey);

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
      await this.cashManagerService.del(cacheKey);
      return;
    }

    // total price for a particular cart by each item
    cacheCart.total = await this.shoppingHelper.calculateTotalPrice(cart);

    await this.cashManagerService.set(cacheKey, cacheCart, 1000 * 60 * 60 * 24);
    return cacheCart;
  }
}
