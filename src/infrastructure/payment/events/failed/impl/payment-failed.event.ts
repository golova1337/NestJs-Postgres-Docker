import Stripe from 'stripe';

export class PaymentFailedEvent {
  constructor(public readonly paymentIntentCreated: Stripe.PaymentIntent) {}
}
