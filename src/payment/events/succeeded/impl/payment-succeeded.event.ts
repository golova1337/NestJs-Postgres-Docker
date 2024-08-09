import Stripe from 'stripe';

export class PaymentSucceededEvent {
  constructor(public readonly paymentIntentCreated: Stripe.PaymentIntent) {}
}
