import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Controllers } from './controllers';
import { Entities } from './entities';
import { Repositories } from './repository';
import { Services } from './services';

@Module({
  imports: [SequelizeModule.forFeature(Entities)],
  controllers: [...Controllers],
  providers: [...Services, ...Repositories],
})
export class InvoicesModule {}
