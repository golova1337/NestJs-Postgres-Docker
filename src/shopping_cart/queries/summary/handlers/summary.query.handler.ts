import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { ShoppingCartHelper } from 'src/shopping_cart/helpers/shopping-helpers';
import { SummaryQuery } from '../impl/summary.query';
import { CashManagerService } from 'src/infrastructure/cash-manager/cash-manager.service';

@QueryHandler(SummaryQuery)
export class SummaryQueryHandler implements IQueryHandler<SummaryQuery> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly shoppingCartHelper: ShoppingCartHelper,
    private readonly cashManagerService: CashManagerService,
  ) {}
  async execute(query: SummaryQuery): Promise<{ cart: any[]; total: number }> {
    const { userId } = query;
    const cacheKey = `cart:${userId}`;

    //get cart
    let cacheCart = await this.cashManagerService.get(cacheKey);

    // check cart
    let cart = cacheCart?.cart;
    if (!cart || cart.length === 0) return;

    //get products id
    const ids = cart.map((item) => item['productId']);

    //get all products, in order to count total price and have current price
    const products = await this.productRepository.findManyProductsByIds(ids);

    // creating a hash table for quick product retrieval
    const productMap: Map<number, any> = new Map(
      products.map((product) => [product.id, product]),
    );

    // receive updated data on each product
    await this.shoppingCartHelper.updateCartData(cart, productMap);

    // // count totaly price
    cacheCart.total = await this.shoppingCartHelper.calculateTotalPrice(cart);

    await this.cashManagerService.set(cacheKey, cacheCart, 1000 * 60 * 60 * 24);

    return cacheCart;
  }
}
