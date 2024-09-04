import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentFailedEvent } from '../impl/payment-failed.event';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { PaymentStatus } from 'src/payment/enum/payment-status.enum';
import { EmojiLogger } from 'src/common/logger/emojiLogger';

@EventsHandler(PaymentFailedEvent)
export class PaymentFailedEventHandler
  implements IEventHandler<PaymentFailedEvent>
{
  logger = new EmojiLogger();
  constructor(private readonly orderRepository: OrderRepository) {}

  async handle(event: PaymentFailedEvent) {
    try {
      const { paymentIntentCreated } = event;
      const orderId = paymentIntentCreated.metadata.orderId;
      let order = await this.orderRepository.findOne(parseInt(orderId, 10));
      order.payment.status = PaymentStatus.Failed;
      await order.save();
    } catch (error) {
      this.logger.error(`Payment failed ${error}`);
    }
  }
}
