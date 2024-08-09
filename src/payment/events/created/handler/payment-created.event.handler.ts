import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentCreatedEvent } from '../impl/payment-created.event';
import { PaymentRepository } from 'src/payment/repositories/payment.repository';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { PaymentProvider } from 'src/payment/enum/provider.enum';
import { PaymentStatus } from 'src/payment/enum/payment-status.enum';
import { EmojiLogger } from 'src/common/logger/emojiLogger';

@EventsHandler(PaymentCreatedEvent)
export class PaymentCreatedEventHandler
  implements IEventHandler<PaymentCreatedEvent>
{
  logger = new EmojiLogger();
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}

  async handle(event: PaymentCreatedEvent) {
    const { paymentIntentCreated } = event;

    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      const orderId = paymentIntentCreated.metadata.orderId;
      const order = await this.orderRepository.findOne(
        parseInt(orderId, 10),
        transaction,
      );

      const createPayment = {
        order_id: parseInt(orderId, 10),
        amount: paymentIntentCreated.amount / 100,
        provider: PaymentProvider.Stripe,
        status: PaymentStatus.Created,
      };

      const payment = await this.paymentRepository.create(
        createPayment,
        transaction,
      );

      order.payment_id = payment.id;

      await order.save({ transaction: transaction });
      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      return;
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);
      this.logger.error(`Payment created ${error}`);
    }
  }
}
