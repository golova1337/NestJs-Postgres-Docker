import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from './services/reviews.service';
import { ReviewRepository } from './repositories/review.repository';

export const Entities = [Review];
export const Services = [ReviewsService];
export const Repository = [ReviewRepository];
@Module({
  imports: [SequelizeModule.forFeature([...Entities])],
  controllers: [ReviewsController],
  providers: [...Services, ...Repository],
})
export class ReviewsModule {}
