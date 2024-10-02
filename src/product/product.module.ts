import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductCommandHandlers } from './commands';
import { Consumers } from './consumers';
import { ProductControllers } from './controllers';
import { Constraints } from './decorators/constraint';
import { Entities } from './entities';
import { ProductQueryHandlers } from './query';
import { Repository } from './repositories';
import { Services } from './services';

@Module({
  imports: [
    CqrsModule,
    SequelizeModule.forFeature([...Entities]),
    BullModule.registerQueue({
      name: 'elastic',
      defaultJobOptions: { removeOnComplete: true },
      streams: { events: { maxLen: 5000 } },
    }),
  ],
  controllers: [...ProductControllers],
  providers: [
    ...Services,
    ...Repository,
    ...ProductCommandHandlers,
    ...Constraints,
    ...ProductQueryHandlers,
    ...Consumers,
  ],
})
export class ProductModule {}
