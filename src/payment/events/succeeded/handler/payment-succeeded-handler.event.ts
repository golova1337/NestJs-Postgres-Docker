import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { PaymentStatus } from 'src/payment/enum/payment-status.enum';
import { PaymentSucceededEvent } from '../impl/payment-succeeded.event';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { OrderStatus } from 'src/order/enum/order-status.enum';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@EventsHandler(PaymentSucceededEvent)
export class PaymentSucceededEventHandler
  implements IEventHandler<PaymentSucceededEvent>
{
  logger = new EmojiLogger();
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async handle(event: PaymentSucceededEvent) {
    try {
      const { paymentIntentCreated } = event;

      const cahceKey = `cart:${paymentIntentCreated.metadata.user}`;

      const orderId = paymentIntentCreated.metadata.orderId;

      let order = await this.orderRepository.findOne(parseInt(orderId, 10));
      order.status = OrderStatus.Placed;
      order.payment.status = PaymentStatus.Succeeded;
      await order.save();

      await this.cacheManager.del(cahceKey);
      return;
    } catch (error) {
      this.logger.error(`Payment created ${error}`);
    }
  }
}
