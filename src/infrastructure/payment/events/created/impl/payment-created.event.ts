import Stripe from 'stripe';

export class PaymentCreatedEvent {
  constructor(public readonly paymentIntentCreated: Stripe.PaymentIntent) {}
}
