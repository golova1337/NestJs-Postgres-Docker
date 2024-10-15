import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewRepository } from '../repositories/review.repository';
import { Review } from '../entities/review.entity';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly logger: MyLogger,
  ) {}
  async create(
    createReviewDto: CreateReviewDto,
    productId: number,
    userId: number,
  ): Promise<{ review: Review }> {
    const review = await this.reviewRepository
      .create({ ...createReviewDto, product_id: productId, user_id: userId })
      .catch((error) => {
        this.logger.error(`create comment ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return { review: review };
  }

  async getReviewsByProduct(id: number): Promise<{ reviews: Review[] }> {
    const reviews = await this.reviewRepository.findAll(id).catch((error) => {
      this.logger.error(`get Reviews By Product ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
    return { reviews: reviews };
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<[affectedCount: number]> {
    return this.reviewRepository.udpate(id, updateReviewDto).catch((error) => {
      this.logger.error(`update Review  ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async remove(id: number): Promise<number> {
    return this.reviewRepository.remove(id).catch((error) => {
      this.logger.error(`remove Review  ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }
}
