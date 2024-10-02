import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AccessTokenGuard } from './common/guards/jwt/accessToken.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AccessTokenStrategy } from './common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './common/strategies/refreshToken.strategy';
import { DiscountModule } from './discount/discount.module';
import { Infrastructure } from './infrastructure';
import { InvoicesModule } from './invoices/invoices.module';
import { JwtTokenModule } from './jwt/jwt.module';
import { LoggerModule } from './logger/logger.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { UserModule } from './user/user.module';

export const BusenessLogic = [
  AuthModule,
  UserModule,
  ProductModule,
  ShoppingCartModule,
  DiscountModule,
  OrderModule,
  ReviewsModule,
  InvoicesModule,
  CategoryModule,
  JwtTokenModule,
];

@Module({
  imports: [
    EventEmitterModule.forRoot({ delimiter: '.' }),
    ...BusenessLogic,
    ...Infrastructure,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useExisting: AccessTokenGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
