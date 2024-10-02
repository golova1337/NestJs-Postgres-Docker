import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateItemCommand } from '../impl/update-item.command';
import { ShoppingCartHelper } from 'src/shopping_cart/helpers/shopping-helpers';
import { CashManagerService } from 'src/infrastructure/cash-manager/cash-manager.service';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateItemCommand)
export class UpdateItemCommandHAndler
  implements ICommandHandler<UpdateItemCommand>
{
  constructor(
    private readonly shoppingHelper: ShoppingCartHelper,
    private readonly cashManagerService: CashManagerService,
  ) {}
  async execute(command: UpdateItemCommand): Promise<{
    cart: any[];
    total: number;
  }> {
    const { updateCartItemDto, userId } = command;

    const { sign, quantity, productId } = updateCartItemDto;

    const cacheKey = `cart:${userId}`;

    let cacheCart = await this.cashManagerService.get(cacheKey);
    let product = await this.shoppingHelper.getProduct(productId);

    if (!cacheCart) throw new BadRequestException('There is not the cart');

    const indexItem = this.shoppingHelper.searchProductInCart(
      cacheCart.cart,
      productId,
    );

    if (indexItem === -1)
      throw new BadRequestException('There is not the item');

    switch (sign) {
      case '-':
        await this.reduceQuanity(
          product,
          cacheCart,
          indexItem,
          quantity,
          cacheKey,
        );
        break;
      case '+':
        await this.increase(product, cacheCart, indexItem, quantity);
        break;
    }

    cacheCart.total = await this.shoppingHelper.calculateTotalPrice(
      cacheCart.cart,
    );

    await this.cashManagerService.set(cacheKey, cacheCart, 1000 * 60 * 60 * 24);

    return cacheCart;
  }

  async reduceQuanity(product, cacheCart, indexItem, quantity, cacheKey) {
    cacheCart.cart[indexItem].quantity -= quantity;
    if (cacheCart.cart[indexItem].quantity <= 0) {
      await this.cashManagerService.del(cacheKey);
      return;
    }

    cacheCart.cart[indexItem].totalPriceForItem = product.discount
      ? this.shoppingHelper.priceWithDiscount(product)
      : cacheCart.cart[indexItem].quantity * cacheCart.cart[indexItem].price;
  }

  async increase(product, cacheCart, indexItem, quantity) {
    const sufficiently =
      cacheCart.cart[indexItem].quantity + quantity <=
      product.inventory.quantity;
    if (!sufficiently) throw new BadRequestException('Insufficient quantity');
    cacheCart.cart[indexItem].quantity += quantity;
    cacheCart.cart[indexItem].totalPriceForItem = product.discount
      ? this.shoppingHelper.priceWithDiscount(product)
      : cacheCart.cart[indexItem].quantity * cacheCart.cart[indexItem].price;
  }
}
