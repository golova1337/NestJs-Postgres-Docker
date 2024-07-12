import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { diskStorage } from 'multer';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { CreateProductAnswerDto } from '../dto/create/Create-product.api.dto';
import { CreateProductDto } from '../dto/create/Create-product.dto';
import { CreatedProductDto } from '../dto/create/Created-product.api.dto';
import { FindAllAnswerDto } from '../dto/findAll/FindAll-products.api.dto';
import { FindAllQueriesDto } from '../dto/findAll/FindAll-products.dto';
import { RemoveProductsDto } from '../dto/remove/Remove-product.dto';
import { UpdateProductCategoryDto } from '../dto/update/Update-product-category.dto';
import { UpdateProductDto } from '../dto/update/Update-product.dto';
import { File } from '../entities/File.entity';
import { ProductInventory } from '../entities/Product-inventory.entity';
import { Product } from '../entities/Product.entity';
import { ProductService } from '../services/product.service';
import { UploadFileService } from '../services/upload-files.service';
import { Size } from 'src/product/enum/multer-enum';

@ApiBearerAuth()
@ApiTags('Products')
@ApiExtraModels(CreateProductAnswerDto, FindAllAnswerDto, CreatedProductDto)
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@Controller('products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('admin')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Creation Product',
    description:
      'If you are an administrator, you can create an item. Do not forget to create a category and a discount before doing so (no discount required).',
  })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(CreateProductAnswerDto),
            },
          },
        },
      ],
    },
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<
    CommonResponseDto<{ product: Product; inventory: ProductInventory }>
  > {
    const result: { product: Product; inventory: ProductInventory } =
      await this.productService.create(createProductDto);
    return CommonResponse.succsessfully({ data: result });
  }

  @Post(':id/upload')
  @Roles('admin')
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: UploadFileService.localStore(),
        filename: UploadFileService.fileNameEditor,
      }),
    }),
  )
  async upload(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: UploadFileService.imageFileFilter(),
        })
        .addMaxSizeValidator({
          maxSize: Size.Product,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<CommonResponseDto<File[]>> {
    const result: File[] = await this.productService.upload(files, id, userId);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get()
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Receiving all products',
    description:
      'If you are a verified user or administrator, you get all the products. There is filtering of requests.',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(FindAllAnswerDto) },
            },
          },
        },
      ],
    },
  })
  async findAll(
    @Query() pagination: FindAllQueriesDto,
  ): Promise<CommonResponseDto<{ rows: Product[]; count: number }>> {
    const result: { rows: Product[]; count: number } =
      await this.productService.findAll(pagination);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get(':id')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({ summary: 'Product search by the id' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(CreatedProductDto),
            },
          },
        },
      ],
    },
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<Product | null>> {
    const result: Product | null = await this.productService.findOne(+id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Patch(':id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Update Product',
    description: 'If you an administartor, you can update product ',
  })
  @ApiCreatedResponse({ type: CommonResponseDto, status: 204 })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<void> {
    const result: [affectedCount: number] = await this.productService.update(
      +id,
      updateProductDto,
    );
    return;
  }

  @Patch(':id/category')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Update Product',
    description: 'If you an administartor, you can update the product category',
  })
  @ApiCreatedResponse({ type: CommonResponseDto, status: 204 })
  async updateCategoria(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<void> {
    const { category_id } = updateProductCategoryDto;
    const result: [affectedCount: number] =
      await this.productService.updateCategory(+id, category_id);
    return;
  }

  @Delete()
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove Product',
    description:
      'If you an administartor, you can remove the product by the id',
  })
  @ApiCreatedResponse({ type: CommonResponseDto, status: 204 })
  async remove(@Body() body: RemoveProductsDto): Promise<number> {
    const ids = body.ids;
    return this.productService.remove(ids);
  }
}
