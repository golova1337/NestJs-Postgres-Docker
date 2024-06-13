import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './auth/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenStrategy } from './common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './common/strategies/refreshToken.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards/jwt/accessToken.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { VerificationCodes } from './auth/entities/verify.entity';
import { Jwt } from './auth/entities/jwt.entity';
import { UserModule } from './user/user.module';
import { UserAddress } from './user/entities/address.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      schema: 'store',
      models: [User, VerificationCodes, Jwt, UserAddress],
      pool: {
        max: 10,
        min: 3,
      },
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
