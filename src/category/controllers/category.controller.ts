import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { CreatedCategoryDto } from '../dto/create/create-category.api.dto';
import { CreateCategoryDto } from '../dto/create/create-category.dto';
import { RemoveCategoriesDto } from '../dto/remove/Remove-category.dto';
import { UpdateCategoryDto } from '../dto/update/update-category.dto';
import { Category } from '../entities/Product-category.entity';
import { CategoryService } from '../services/category.service';

@ApiTags('Categories')
@ApiBearerAuth()
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(CreatedCategoryDto)
@Controller('products/categories')
@UseGuards(RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles('admin')
  @HttpCode(201)
  @ApiOperation({ summary: 'Creation category', description: 'Only for admin' })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(CreatedCategoryDto),
            },
          },
        },
      ],
    },
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CommonResponseDto<Category>> {
    const result: Category =
      await this.categoryService.create(createCategoryDto);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get()
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Receiving all category',
    description: 'For admin and user',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CreatedCategoryDto) },
            },
          },
        },
      ],
    },
  })
  async findAll(): Promise<CommonResponseDto<Category[]>> {
    const result: Category[] = await this.categoryService.findAll();
    return CommonResponse.succsessfully({ data: result });
  }

  @Get(':id')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Receiving one category',
    description: 'For admin and user',
  })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(CreatedCategoryDto),
            },
          },
        },
      ],
    },
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<Category | null>> {
    const result: Category | null = await this.categoryService.findOne(+id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Patch(':id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Update category',
    description: 'Only for admin ',
  })
  @ApiCreatedResponse({ status: 204 })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const result: number = await this.categoryService.update(
      +id,
      updateCategoryDto,
    );
    return;
  }

  @Delete()
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove category',
    description: 'For admin only, you can delete multiple categories at once ',
  })
  @ApiCreatedResponse({ status: 204 })
  async remove(@Body() body: RemoveCategoriesDto): Promise<any> {
    const { ids } = body;
    await this.categoryService.remove(ids);
    return;
  }
}
