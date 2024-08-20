import { Injectable } from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderHelpers {
  priceWithDiscount(product) {
    const discountFactor = (100 - product.discount['discount_percent']) / 100;
    const priceWithDiscount = product.price * discountFactor;
    return parseFloat(priceWithDiscount.toFixed(2));
  }

  async decreaseQuantityAndSave(product, item, transaction) {
    const currentlyQuantity = product.inventory.quantity - item.quantity;

    return product.inventory.update(
      { quantity: currentlyQuantity },
      { transaction },
    );
  }

  createItem(order, product, item) {
    return {
      order_id: order.id,
      product_id: product.id,
      quantity: item.quantity,
      unit_price: product.discount
        ? this.priceWithDiscount(product)
        : parseFloat(product.price),
    };
  }

  async getProductIdsFromCart(cart): Promise<number[]> {
    return cart.map((item) => item.productId);
  }

  async createColection(products: Product[]): Promise<Map<string, Product>> {
    return new Map(products.map((product) => [product.id, product]));
  }

  async calculateTotalPrice(items): Promise<number> {
    return items.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.unit_price * currentValue.quantity,
      0,
    );
  }
}
