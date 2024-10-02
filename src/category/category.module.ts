import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Controllers } from './controllers';
import { Category } from './entities/category.entity';
import { Repositories } from './repositories';
import { Services } from './services';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  controllers: [...Controllers],
  providers: [...Services, ...Repositories],
})
export class CategoryModule {}
