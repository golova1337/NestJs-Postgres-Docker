import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommandHandlers } from './commands';
import { Controllers } from './controllers';
import { UserEntities } from './entities';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { Services } from './services';

@Module({
  imports: [SequelizeModule.forFeature(UserEntities), CqrsModule],
  controllers: [...Controllers],
  providers: [
    ...Repositories,
    ...QueryHandlers,
    ...CommandHandlers,
    ...Services,
  ],
})
export class UserModule {}
