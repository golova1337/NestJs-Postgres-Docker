import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderStatus } from 'src/order/enum/order-status.enum';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { PaymentStatus } from 'src/infrastructure/payment/enum/payment-status.enum';
import { PaymentSucceededEvent } from '../impl/payment-succeeded.event';
import { CashManagerService } from 'src/infrastructure/cash-manager/cash-manager.service';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@EventsHandler(PaymentSucceededEvent)
export class PaymentSucceededEventHandler
  implements IEventHandler<PaymentSucceededEvent>
{
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cashManagerService: CashManagerService,
    private readonly logger: MyLogger,
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

      await this.cashManagerService.del(cahceKey);
      return;
    } catch (error) {
      this.logger.error(`Payment created ${error}`);
    }
  }
}
