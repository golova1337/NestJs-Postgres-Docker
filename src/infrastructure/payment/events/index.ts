import { PaymentCanceledEventHandler } from './canceled/handler/payment-canceled-handler.event';
import { PaymentCreatedEventHandler } from './created/handler/payment-created.event.handler';
import { PaymentFailedEventHandler } from './failed/handler/payment-failed-handler.event';
import { PaymentSucceededEventHandler } from './succeeded/handler/payment-succeeded-handler.event';

export const Events = [
  PaymentCreatedEventHandler,
  PaymentSucceededEventHandler,
  PaymentCanceledEventHandler,
  PaymentFailedEventHandler,
];
