import { Global, Module } from '@nestjs/common';
import { CustomTwilioService } from './twilio.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';

@Global()
@Module({
  imports: [
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accountSid: configService.get('twilio.accountSid'),
        authToken: configService.get('twilio.authToken'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CustomTwilioService],
  exports: [CustomTwilioService],
})
export class CustomTwilioModule {}
