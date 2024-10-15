import Stripe from 'stripe';

export class PaymentCanceledEvent {
  constructor(public readonly paymentIntentCreated: Stripe.PaymentIntent) {}
}