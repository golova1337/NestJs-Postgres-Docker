import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cache } from 'cache-manager';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { FindOneProductQuery } from 'src/product/queries/products/findOne/impl/find-one-product.query';
import { CreateCartItemDto } from '../dto/create-shopping_cart.dto';
import { UpdateItemDto } from '../dto/update-shopping_cart.dto';
import { FindManyProductsByIdsCommand } from '../queries/summary/impl/summary.command';

@Injectable()
export class CartService {
  logger = new EmojiLogger();
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async addItem(createCartItemDto: CreateCartItemDto, userId: number) {
    const { productId, quantity } = createCartItemDto;

    // create key for Redis
    const cacheKey = `cart:${userId}`;

    //get current data the cart and the product that the user want to add in the shopping cart
    let [cacheCart, product] = await this.getCacheCartAndProduct(
      cacheKey,
      productId,
    ).catch((error) => {
      this.logger.error(`receiving Cache cart and product ${error}`);
      throw new InternalServerErrorException('Server Error');
    });

    if (!cacheCart) cacheCart = { cart: [], total: 0 };

    let cart = cacheCart.cart;
    const indexItem = cart.findIndex((item) => item.productId === productId);

    if (indexItem !== -1) {
      // finding out that the current quantity and the quantity the user wants to add are not more than the item's inventory
      if (cart[indexItem].quantity + quantity > product.inventory.quantity) {
        throw new BadRequestException('The amount of product is not enough');
      }
      // update quantity to calculation total price for a particular item
      const updatedQuantity = cart[indexItem]['quantity'] + quantity;
      cart[indexItem] = this.createItem(productId, updatedQuantity, product);
    } else {
      cart.push(this.createItem(productId, quantity, product));
    }

    // total price for a particular cart by each item
    cacheCart['total'] = await this.calculateTotalPrice(cart);

    await this.cacheManager.set(cacheKey, cacheCart, 1000 * 60 * 60 * 24);
    return;
  }

  async summary(userId: number) {
    // make cart key
    const cacheKey = `cart:${userId}`;

    //get cart
    let cacheCart = await this.cacheManager.get<{ cart: any[]; total: number }>(
      cacheKey,
    );

    // check cart
    let cart = cacheCart?.cart;
    if (!cart || cart.length === 0) return;

    //get products id
    const ids = cart.map((item) => item['productId']);

    //get all products, in order to count total price and have current price
    const products = await this.queryBus
      .execute(new FindManyProductsByIdsCommand(ids))
      .catch((error) => {
        this.logger.error(`Find Many Products By Ids Command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });

    // creating a hash table for quick product retrieval
    const productMap: Map<number, any> = new Map(
      products.map((product) => [product.id, product]),
    );

    // receive updated data on each product
    await this.updateCartData(cart, productMap);

    // // count totaly price
    cacheCart.total = await this.calculateTotalPrice(cart);

    await this.cacheManager.set(cacheKey, cacheCart, 1000 * 60 * 60 * 24);

    return cacheCart;
  }

  async updateItem(userId: number, updateCartItemDto: UpdateItemDto) {
    const { sign, quantity, productId } = updateCartItemDto;
    const cacheKey = `cart:${userId}`;
    let [cacheCart, product] = await this.getCacheCartAndProduct(
      cacheKey,
      productId,
    );
    // check cart
    if (!cacheCart) {
      cacheCart = { cart: [], total: 0 };
    }

    const cart = cacheCart.cart;
    const indexItem = cart.findIndex((item) => item.productId === productId);

    if (indexItem !== -1) {
      switch (sign) {
        case '-':
          this.removeQuantity(cart, indexItem, quantity, product, cacheKey);
          break;
        case '+':
          this.addQuantity(cart, indexItem, quantity, product);
          break;

        default:
          break;
      }
    } else if (sign === '+') {
      cart.push(this.createItem(productId, quantity, product));
    } else if (sign === '-') return; //if there is not the item and sign = -, we do not create, we can not go negative

    cacheCart.total = await this.calculateTotalPrice(cart);
    await this.cacheManager.set(cacheKey, cacheCart, 1000 * 60 * 60 * 24);

    return cacheCart;
  }

  async removeItem(itemId: number, userId: number) {
    // create chache key
    const cacheKey = `cart:${userId}`;

    // get cart
    let cacheCart = await this.cacheManager.get<{ cart: any[]; total: number }>(
      cacheKey,
    );

    // check
    if (!cacheCart) throw new BadRequestException('Bad Request');

    let cart = cacheCart.cart;
    // get index item
    const indexItem = cart.findIndex((i) => i.productId === itemId);

    // item does not exist
    if (indexItem === -1) return cacheCart;

    //  item exists , we remove item
    cart.splice(indexItem, 1);

    // if cart is empty we remove cart
    if (cart.length === 0) {
      await this.cacheManager.del(cacheKey);
      return;
    }

    // total price for a particular cart by each item
    cacheCart.total = await this.calculateTotalPrice(cart);

    await this.cacheManager.set(cacheKey, cacheCart, 1000 * 60 * 60 * 24);
    return cacheCart;
  }

  private async updateCartData(cart: any[], productMap: Map<number, any>) {
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

  private async getCacheCartAndProduct(cacheKey: string, productId: number) {
    return Promise.all([
      this.cacheManager.get<{ cart: any[]; total: number }>(cacheKey),
      this.queryBus.execute(new FindOneProductQuery(productId)),
    ]);
  }

  private async removeQuantity(
    cart,
    indexItem,
    changeQuantity,
    product,
    cacheKey,
  ) {
    let item = cart[indexItem];

    if (item.quantity - changeQuantity <= 0) {
      // delete from the cart
      cart.splice(indexItem, 1);
      if (cart.length === 0) {
        await this.cacheManager.del(cacheKey);
        return;
      }
    } else {
      item.quantity -= changeQuantity;
      cart[indexItem] = this.createItem(item.productId, item.quantity, product);
    }
    return;
  }

  private addQuantity(cart, indexItem, changeQuantity, product) {
    let item = cart[indexItem];
    if (item.quantity + changeQuantity > product.inventory.quantity) {
      throw new BadRequestException('The amount of product is not enough');
    } else {
      item.quantity += changeQuantity;
      cart[indexItem] = this.createItem(item.productId, item.quantity, product);
    }

    return;
  }

  private async calculateTotalPrice(cart): Promise<number> {
    let totalPriceForCart = 0;
    for (let i = 0; i < cart.length; i++) {
      totalPriceForCart += cart[i]['totalPriceForItem'];
    }
    return parseFloat(totalPriceForCart.toFixed(2));
  }

  private priceWithDiscount(product) {
    const discountFactor = (100 - product.discount['discount_percent']) / 100;
    const priceWithDiscount = product.price * discountFactor;
    return parseFloat(priceWithDiscount.toFixed(2));
  }

  private createItem(productId, quantity, product) {
    let item = {};

    item['productId'] = productId;
    item['quantity'] = quantity;
    item['price'] = Number(product.price);
    item['discount'] = product.discount
      ? Number(product.discount['discount_percent'])
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
