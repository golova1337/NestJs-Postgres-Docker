import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderModule } from 'src/order/order.module';
import { PaymentController } from './controllers/payment.controller';
import { Entities } from './entities';
import { Events } from './events';
import { Repositories } from './repositories';
import { Services } from './services';

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities]), OrderModule],
  controllers: [PaymentController],
  providers: [...Services, ...Repositories, ...Events],
})
export class PaymentModule {}
