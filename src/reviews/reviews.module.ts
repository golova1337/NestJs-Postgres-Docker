import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewsController } from './controllers/reviews.controller';
import { Entities } from './entities';
import { Repository } from './repositories';
import { Services } from './services';

@Module({
  imports: [SequelizeModule.forFeature([...Entities])],
  controllers: [ReviewsController],
  providers: [...Services, ...Repository],
})
export class ReviewsModule {}
