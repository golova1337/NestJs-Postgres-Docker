import { CashManagerModule } from './cash-manager/cash-manager.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { PaymentModule } from './payment/payment.module';
import { QueueModule } from './queue/queue.module';
import { SearchModule } from './search/search.module';
import { CustomTwilioModule } from './twilio/twilio.module';

export const Infrastructure = [
  DatabaseModule,
  CashManagerModule,
  ConfigurationModule,
  NodemailerModule,
  CustomTwilioModule,
  SearchModule,
  PaymentModule,
  QueueModule,
];
