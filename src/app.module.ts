import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { Jwt } from './auth/entities/Jwt.entity';
import { Otp } from './auth/entities/Otp.entity';
import { User } from './auth/entities/User.entity';
import { AccessTokenGuard } from './common/guards/jwt/accessToken.guard';
import { AccessTokenStrategy } from './common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './common/strategies/refreshToken.strategy';
import { ProductDiscount } from './product/entities/Product-discount.entity';
import { Product } from './product/entities/Product.entity';
import { ProductInventory } from './product/entities/Product-inventory.entity';
import { ProductModule } from './product/product.module';
import { UserAddress } from './user-settings/entities/Address.entity';
import { UserModule } from './user-settings/user.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/Product-category.entity';

export const Entities = [
  User,
  UserAddress,
  Otp,
  Product,
  ProductInventory,
  ProductDiscount,
  Category,
  Jwt,
];
export const Modules = [AuthModule, UserModule, CategoryModule, ProductModule];
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
      models: [...Entities],
      pool: {
        max: 10,
        min: 3,
      },
      autoLoadModels: true,
      synchronize: true,
    }),
    ...Modules,
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
