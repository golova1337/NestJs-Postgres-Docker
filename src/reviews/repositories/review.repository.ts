import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import sequelize, { Transaction } from 'sequelize';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(Review)
    private reviewModel: typeof Review,
  ) {}
  async create(
    date: CreateReviewDto & { product_id: number; user_id: number },
  ): Promise<Review> {
    return this.reviewModel.create(date);
  }
  async findAll(productId: number): Promise<Review[]> {
    return this.reviewModel.findAll({ where: { product_id: productId } });
  }

  async udpate(
    reviewId: number,
    data: UpdateReviewDto,
  ): Promise<[affectedCount: number]> {
    return this.reviewModel.update(data, { where: { id: reviewId } });
  }

  async remove(reviewId: number): Promise<number> {
    return this.reviewModel.destroy({ where: { id: reviewId } });
  }

  async averageProductRating(product_id: number, transaction?: Transaction) {
    return this.reviewModel.findOne({
      attributes: [
        [
          sequelize.fn(
            'ROUND',
            sequelize.fn('AVG', sequelize.col('rating')),
            2,
          ),
          'avgRating',
        ],
      ],
      where: { product_id },
      raw: true,
      transaction: transaction,
    });
  }
}
