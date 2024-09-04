import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { CurrentUser } from 'src/common/decorators/user/currentUser.decorator';
import { Review } from '../entities/review.entity';
import { ApiCommonResponse } from 'src/common/decorators/apiSchemas/commonResponse';

@ApiBearerAuth()
@ApiTags('Reviews')
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@UseGuards(RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('product/:productId')
  @Roles('admin', 'user')
  @HttpCode(201)
  @ApiOperation({ summary: 'Creation a review' })
  @ApiCommonResponse(CreateReviewDto)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Param('productId') productId: number,
    @CurrentUser('id') userId: number,
  ): Promise<CommonResponseDto<Review>> {
    const result = await this.reviewsService.create(
      createReviewDto,
      productId,
      userId,
    );
    return CommonResponse.succsessfully({ data: result });
  }

  @Get('product/:productId')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({ summary: 'Recieve all reviews' })
  @ApiCommonResponse(CreateReviewDto)
  async findAll(
    @Param('productId') productId: number,
  ): Promise<CommonResponseDto<Review[]>> {
    const result = await this.reviewsService.getReviewsByProduct(productId);
    return CommonResponse.succsessfully({ data: result });
  }

  @Patch(':id')
  @Roles('admin', 'user')
  @HttpCode(204)
  @ApiOperation({ summary: 'Update a review' })
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<void> {
    const result = await this.reviewsService.update(id, updateReviewDto);
    return;
  }

  @Delete(':id')
  @Roles('admin', 'user')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a review' })
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.reviewsService.remove(id);
    return;
  }
}
