import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { CashManagerService } from 'src/infrastructure/cash-manager/cash-manager.service';
import { OrderHelpers } from 'src/order/helpers/order.helper';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { GetAndCheckOrderItemQuery } from '../impl/get-and-check-order-item.query';

@QueryHandler(GetAndCheckOrderItemQuery)
export class GetAndCheckOrderItemQueryHandler
  implements ICommandHandler<GetAndCheckOrderItemQuery>
{
  constructor(
    private readonly orderHelpers: OrderHelpers,
    private readonly productRepository: ProductRepository,
    private readonly cashManagerService: CashManagerService,
  ) {}

  async execute(command: GetAndCheckOrderItemQuery) {
    const { userId } = command;
    const cacheKey = `cart:${userId}`;

    // check cart
    const cacheCart = await this.cashManagerService.get(cacheKey);

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
