import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CashManagerService } from 'src/infrastructure/cash-manager/cash-manager.service';
import { ShoppingCartHelper } from 'src/shopping_cart/helpers/shopping-helpers';
import { AddItemCommand } from '../impl/add-item.command';

@CommandHandler(AddItemCommand)
export class AddItemCommandHandler implements ICommandHandler<AddItemCommand> {
  constructor(
    private readonly shoppingCartHelper: ShoppingCartHelper,
    private readonly cashManagerService: CashManagerService,
  ) {}
  async execute(command: AddItemCommand): Promise<any> {
    const { createCartItemDto, userId } = command;
    const { productId, quantity } = createCartItemDto;

    // create key for Redis
    const cacheKey = `cart:${userId}`;

    //get current data the cart and the product that the user want to add in the shopping cart
    let cacheCart = await this.cashManagerService.get(cacheKey);
    if (!cacheCart) cacheCart = { cart: [], total: 0 };

    const indexItem = this.shoppingCartHelper.searchProductInCart(
      cacheCart.cart,
      productId,
    );

    let product = await this.shoppingCartHelper.getProduct(productId);
    let quantityInStore = product.inventory.quantity;

    if (indexItem === -1 && quantityInStore >= quantity) {
      cacheCart.cart.push(
        this.shoppingCartHelper.createItem(productId, quantity, product),
      );
    } else {
      // find out that the current quantity and the quantity the user wants to add are not more than the item's inventory
      const isInventorySufficient =
        cacheCart.cart[indexItem].quantity + quantity > quantityInStore;

      if (isInventorySufficient) {
        throw new BadRequestException('The amount of product is not enough');
      }
      // update quantity to calculation total price for a particular item
      const updatedQuantity = cacheCart.cart[indexItem]['quantity'] + quantity;

      cacheCart.cart[indexItem] = this.shoppingCartHelper.createItem(
        productId,
        updatedQuantity,
        product,
      );
    }

    // total price for a particular cart by each item
    cacheCart.total = this.shoppingCartHelper.calculateTotalPrice(
      cacheCart.cart,
    );

    await this.cashManagerService.set(cacheKey, cacheCart, 1000 * 60 * 60 * 24);
    return;
  }
}
