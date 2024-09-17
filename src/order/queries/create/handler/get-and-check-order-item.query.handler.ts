import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAndCheckOrderItemQuery } from '../impl/get-and-check-order-item.query';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { OrderHelpers } from 'src/order/helpers/order.helper';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@QueryHandler(GetAndCheckOrderItemQuery)
export class GetAndCheckOrderItemQueryHandler
  implements ICommandHandler<GetAndCheckOrderItemQuery>
{
  constructor(
    private readonly orderHelpers: OrderHelpers,
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: GetAndCheckOrderItemQuery) {
    const { userId } = command;
    const cacheKey = `cart:${userId}`;

    // check cart
    const cacheCart = await this.cacheManager.get<{
      cart: any[];
      total: number;
    }>(cacheKey);

    const cart = cacheCart?.cart;
    if (!cart || cart.length === 0)
      throw new BadRequestException('Bad Request');

    //get all product ids from a cart
    const ids = await this.orderHelpers.getProductIdsFromCart(cart);

    //get products by id from DB
    const products = await this.productRepository.findManyProductsByIds(ids);

    //create a Map colection for quick recieving
    const productsMap = await this.orderHelpers.createColection(products);

    //check product
    for (const item of cart) {
      const product = productsMap.get(item.productId);

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }
      const exceedsInventory = item.quantity > product.inventory.quantity;
      if (exceedsInventory) {
        throw new BadRequestException(
          `Insufficient quantity for Product with ID ${item.productId}`,
        );
      }
    }
    return cacheCart;
  }
}
