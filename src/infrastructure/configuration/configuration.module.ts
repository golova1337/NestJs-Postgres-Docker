import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import nodemailerConfig from './config/nodemailer.config';
import elasticseachConfig from './config/elasticseach.config';
import twilioConfig from './config/twilio.config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import stripeConfig from './config/stripe.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        jwtConfig,
        databaseConfig,
        redisConfig,
        nodemailerConfig,
        elasticseachConfig,
        twilioConfig,
        stripeConfig,
      ],
    }),
  ],
})
export class ConfigurationModule {}
