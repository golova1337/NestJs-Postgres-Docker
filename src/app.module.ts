import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BusenessLogic } from 'src';
import { AccessTokenGuard } from './common/guards/jwt/accessToken.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AccessTokenStrategy } from './common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './common/strategies/refreshToken.strategy';
import { Infrastructure } from './infrastructure';

@Module({
  imports: [
    EventEmitterModule.forRoot({ delimiter: '.' }),
    ...BusenessLogic,
    ...Infrastructure,
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
