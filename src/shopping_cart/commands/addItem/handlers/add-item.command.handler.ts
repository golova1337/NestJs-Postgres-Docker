import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddItemCommand } from '../impl/add-item.command';
import { ShoppingCartHelper } from 'src/shopping_cart/helpers/shopping-helper';
import { BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@CommandHandler(AddItemCommand)
export class AddItemCommandHandler implements ICommandHandler<AddItemCommand> {
  constructor(
    private readonly shoppingCartHelper: ShoppingCartHelper,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  async execute(command: AddItemCommand): Promise<any> {
    const { createCartItemDto, userId } = command;
    const { productId, quantity } = createCartItemDto;

    // create key for Redis
    const cacheKey = `cart:${userId}`;

    //get current data the cart and the product that the user want to add in the shopping cart
    let cacheCart = await this.shoppingCartHelper.getCacheCart(cacheKey);
    let product = await this.shoppingCartHelper.getProduct(productId);

    if (!cacheCart) cacheCart = { cart: [], total: 0 };

    const indexItem = this.shoppingCartHelper.searchProductinCart(
      cacheCart.cart,
      productId,
    );

    if (indexItem !== -1) {
      // finding out that the current quantity and the quantity the user wants to add are not more than the item's inventory
      if (
        cacheCart.cart[indexItem].quantity + quantity >
        product.inventory.quantity
      ) {
        throw new BadRequestException('The amount of product is not enough');
      }
      // update quantity to calculation total price for a particular item
      const updatedQuantity = cacheCart.cart[indexItem]['quantity'] + quantity;
      cacheCart.cart[indexItem] = this.shoppingCartHelper.createItem(
        productId,
        updatedQuantity,
        product,
      );
    } else {
      cacheCart.cart.push(
        this.shoppingCartHelper.createItem(productId, quantity, product),
      );
    }

    // total price for a particular cart by each item
    cacheCart['total'] = await this.shoppingCartHelper.calculateTotalPrice(
      cacheCart.cart,
    );

    await this.shoppingCartHelper.setCacheCart(cacheKey, cacheCart);
    return;
  }
}
