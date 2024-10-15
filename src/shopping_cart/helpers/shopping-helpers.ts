import { BadRequestException, Injectable } from '@nestjs/common';
import { CashManagerService } from 'src/infrastructure/cash-manager/cash-manager.service';
import { ProductRepository } from 'src/product/repositories/product.repository';

@Injectable()
export class ShoppingCartHelper {
  constructor(
    private readonly cashManagerService: CashManagerService,
    private readonly productRepository: ProductRepository,
  ) {}
  async updateCartData(cart: any[], productMap: Map<number, any>) {
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const product = productMap.get(item.productId);

      if (product) {
        cart[i] = this.createItem(item.productId, item.quantity, product);
      } else {
        // Handle the case when the product is not found
        cart[i].price = 0;
        cart[i].priceWithDiscount = null;
        cart[i].discount = null;
        cart[i].totalPriceForItem = 0;
      }
    }
  }

  searchProductInCart(cart, productId) {
    return cart.findIndex((item) => item.productId === productId);
  }

  async getProduct(productId: number) {
    return this.productRepository.findProductById(productId);
  }

  async removeQuantity(cart, indexItem, changeQuantity, product, cacheKey) {
    let item = cart[indexItem];

    if (item.quantity - changeQuantity <= 0) {
      // delete from the cart
      cart.splice(indexItem, 1);
      if (cart.length === 0) {
        await this.cashManagerService.del(cacheKey);
        return;
      }
    } else {
      item.quantity -= changeQuantity;
      cart[indexItem] = this.createItem(item.productId, item.quantity, product);
    }
    return;
  }

  addQuantity(cart, indexItem, changeQuantity, product) {
    let item = cart[indexItem];
    if (item.quantity + changeQuantity > product.inventory.quantity) {
      throw new BadRequestException('The amount of product is not enough');
    } else {
      item.quantity += changeQuantity;
      cart[indexItem] = this.createItem(item.productId, item.quantity, product);
    }

    return;
  }

  calculateTotalPrice(cart) {
    let totalPriceForCart = 0;
    for (let i = 0; i < cart.length; i++) {
      totalPriceForCart += cart[i]['totalPriceForItem'];
    }

    return totalPriceForCart;
  }

  priceWithDiscount(product) {
    const discountFactor = (100 - product.discount['discount_percent']) / 100;
    const priceWithDiscount = product.price * discountFactor;
    return parseFloat(priceWithDiscount.toFixed(2));
  }

  createItem(productId, quantity, product) {
    let item = {};

    item['productId'] = productId;
    item['quantity'] = quantity;
    item['price'] = product.price;
    item['discount'] = product.discount
      ? product.discount['discount_percent']
      : null;
    item['priceWithDiscount'] = product.discount
      ? this.priceWithDiscount(product)
      : null;
    item['totalPriceForItem'] = product.discount
      ? item['quantity'] * item['priceWithDiscount']
      : item['quantity'] * item['price'];

    return item;
  }
}
