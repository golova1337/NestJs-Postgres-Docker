import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueueModule } from 'src/infrastructure/queue/queue.module';
import { CommandHandlers } from './commands';
import { Consumers } from './consumers';
import { AuthController } from './controllers/auth.controller';
import { Constraint } from './decorators/constraint';
import { Entities } from './entities';
import { QueryHandlers } from './queries';
import { Repository } from './repositories';
import { Services } from './services';

@Module({
  imports: [
    QueueModule,
    SequelizeModule.forFeature([...Entities]),
    BullModule.registerQueue({
      name: 'sent-sms',
      defaultJobOptions: { removeOnComplete: true },
      streams: { events: { maxLen: 5000 } },
    }),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    ...Repository,
    ...Constraint,
    ...Consumers,
    ...QueryHandlers,
    ...CommandHandlers,
    ...Services,
  ],
})
export class AuthModule {}
