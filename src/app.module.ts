import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SequelizeModule } from '@nestjs/sequelize';
import { Discount } from 'src/discount/entities/discount.entity';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthModule } from './auth/auth.module';
import { Jwt } from './auth/entities/jwt.entity';
import { Otp } from './auth/entities/otp.entity';
import { User } from './auth/entities/user.entity';
import { AccessTokenGuard } from './common/guards/jwt/accessToken.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AccessTokenStrategy } from './common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './common/strategies/refreshToken.strategy';
import { DiscountModule } from './discount/discount.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { OrderItem } from './order/entities/order-item.entity';
import { Order } from './order/entities/order.entity';
import { OrderModule } from './order/order.module';
import { Payment } from './payment/entities/payment.entity';
import { PaymentModule } from './payment/payment.module';
import { Category } from './product/entities/category.entity';
import { File } from './product/entities/file.entity';
import { Inventory } from './product/entities/inventory.entity';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { Review } from './reviews/entities/review.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { Address } from './user/entities/Address.entity';
import { UserModule } from './user/user.module';

export const Entities = [
  User,
  Address,
  Otp,
  Product,
  Inventory,
  Discount,
  Category,
  Jwt,
  File,
  Order,
  OrderItem,
  Payment,
  Review,
];

export const Modules = [
  AuthModule,
  UserModule,
  ProductModule,
  ShoppingCartModule,
  DiscountModule,
  OrderModule,
  PaymentModule,
  ReviewsModule,
];

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
      connection: {
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

    CacheModule.register({
      isGlobal: true,
      store: redisStore,

      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    }),
    EventEmitterModule.forRoot({ delimiter: '.' }),
    ...Modules,
    ElasticsearchModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
