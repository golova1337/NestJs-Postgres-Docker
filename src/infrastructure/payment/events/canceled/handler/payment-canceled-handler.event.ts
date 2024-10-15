import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { PaymentStatus } from 'src/infrastructure/payment/enum/payment-status.enum';
import { PaymentCanceledEvent } from '../impl/payment-canceled.event';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@EventsHandler(PaymentCanceledEvent)
export class PaymentCanceledEventHandler
  implements IEventHandler<PaymentCanceledEvent>
{
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly logger: MyLogger,
  ) {}

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
