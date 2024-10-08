import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { PaymentStatus } from 'src/payment/enum/payment-status.enum';
import { PaymentCanceledEvent } from '../impl/payment-canceled.event';

@EventsHandler(PaymentCanceledEvent)
export class PaymentCanceledEventHandler
  implements IEventHandler<PaymentCanceledEvent>
{
  logger = new EmojiLogger();
  constructor(private readonly orderRepository: OrderRepository) {}

  async handle(event: PaymentCanceledEvent) {
    try {
      const { paymentIntentCreated } = event;
      const orderId = paymentIntentCreated.metadata.orderId;
      let order = await this.orderRepository.findOne(parseInt(orderId, 10));
      order.payment.status = PaymentStatus.Cancelled;
      await order.save();
    } catch (error) {
      this.logger.error(`Payment canceled ${error}`);
    }
  }
}
