import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatedCategoryDto } from 'src/category/dto/category/create/create-category.api.dto';
import { CreateCategoryDto } from 'src/category/dto/category/create/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/category/update/update-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { ApiCommonResponse } from 'src/common/decorators/apiSchemas/commonResponse';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { CategoryService } from '../services/category.service';

@ApiBearerAuth()
@ApiTags('Categories')
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@UseGuards(RolesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @Roles('admin')
  @HttpCode(201)
  @ApiOperation({ summary: 'Creation category', description: 'Only for admin' })
  @ApiCommonResponse(CreatedCategoryDto)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CommonResponseDto<Category>> {
    const result: Category =
      await this.categoryService.createCategory(createCategoryDto);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get()
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Receiving all category',
    description: 'For admin and user',
  })
  @ApiCommonResponse(CreatedCategoryDto)
  async findAllCategories(): Promise<CommonResponseDto<Category[]>> {
    const result: Category[] = await this.categoryService.findAllCategories();
    return CommonResponse.succsessfully({ data: result });
  }

  @Get('/:id')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Receiving one category',
    description: 'For admin and user',
  })
  @ApiCommonResponse(CreatedCategoryDto)
  async findCategoryById(
    @Param('id') id: number,
  ): Promise<CommonResponseDto<Category | null>> {
    const result: Category | null =
      await this.categoryService.findCategoryById(id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Put('/:id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Update category',
    description: 'Only for admin ',
  })
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const result: [affectedCount: number] =
      await this.categoryService.updateCategory(id, updateCategoryDto);
    return;
  }

  @Delete('/:id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove category',
    description: 'For admin only, you can delete multiple categories at once ',
  })
  async removeCategory(@Param('id') id: number): Promise<any> {
    await this.categoryService.removeCategory(id);
    return;
  }
}
