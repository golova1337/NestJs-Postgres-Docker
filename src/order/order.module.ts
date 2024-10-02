import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Commands } from './commands';
import { OrderController } from './controllers/order.controller';
import { Entities } from './entities';
import { Helpers } from './helpers';
import { Queries } from './queries';
import { Repositories } from './repositories';
import { OrderRepository } from './repositories/order.repository';
import { Services } from './services';

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities])],
  controllers: [OrderController],
  providers: [
    ...Services,
    ...Repositories,
    ...Commands,
    ...Helpers,
    ...Queries,
  ],
  exports: [OrderRepository],
})
export class OrderModule {}
