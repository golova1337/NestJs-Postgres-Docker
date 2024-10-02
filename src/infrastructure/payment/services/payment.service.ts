import { BadRequestException, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { OrderRepository } from 'src/order/repositories/order.repository';
import Stripe from 'stripe';
import { PaymentCreatedEvent } from '../events/created/impl/payment-created.event';
import { PaymentSucceededEvent } from '../events/succeeded/impl/payment-succeeded.event';
import { PaymentFailedEvent } from '../events/failed/impl/payment-failed.event';
import { PaymentCanceledEvent } from '../events/canceled/impl/payment-canceled.event';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  stripe: Stripe;
  constructor(
    private readonly ordersRepository: OrderRepository,
    private readonly eventBus: EventBus,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('stripe.sk_test'), {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(orderId: number): Promise<{ secret_key: string }> {
    const order = await this.ordersRepository.findOne(orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100),
      currency: 'usd',
      metadata: {
        user: order.user_id.toString(),
        orderId: order.id.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { secret_key: paymentIntent.client_secret };
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.created':
        const paymentIntentCreated = event.data.object as Stripe.PaymentIntent;
        this.eventBus.publish(new PaymentCreatedEvent(paymentIntentCreated));

        break;

      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data
          .object as Stripe.PaymentIntent;
        this.eventBus.publish(new PaymentSucceededEvent(paymentIntentCreated));
        break;

      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        this.eventBus.publish(new PaymentFailedEvent(paymentIntentCreated));
        break;

      case 'payment_intent.canceled':
        const paymentIntentCanceled = event.data.object as Stripe.PaymentIntent;
        this.eventBus.publish(new PaymentCanceledEvent(paymentIntentCreated));
        break;

      default:
        `Unhandled event type ${event.type}`;
    }

    return;
  }
}
