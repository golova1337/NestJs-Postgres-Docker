import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCommonResponse } from 'src/common/decorators/apiSchemas/commonResponse';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { CreatedCategoryDto } from '../dto/category/create/create-category.api.dto';
import { CreateCategoryDto } from '../dto/category/create/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update/update-category.dto';
import { CreateProductDto } from '../dto/product/create/create-product.dto';
import { CreateProductAnswerDto } from '../dto/product/create/openApi/create-product-answer.api.dto';
import { FindAllQueriesDto } from '../dto/product/findAll/findAll-products.dto';
import { FindAllAnswerDto } from '../dto/product/findAll/openApi/findAll-products.api.dto';
import { FindOneDto } from '../dto/product/findOrUpdateOne/findOrUpdateOne.dto';
import { RemoveProductsDto } from '../dto/product/remove/remove-product.dto';
import { UpdateProductDto } from '../dto/product/update/update-product.dto';
import { Category } from '../entities/category.entity';
import { File } from '../entities/file.entity';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { FileService } from '../services/files.service';
import { ProductService } from '../services/product.service';
import { FindOneProduct } from '../dto/product/findOrUpdateOne/openApi/find-one-product.api';
import { ApplyDiscountDto } from '../dto/product/applyDiscount/apply-discount.dto';

@ApiBearerAuth()
@ApiTags('Products')
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@Controller('products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('categories')
  @Roles('admin')
  @HttpCode(201)
  @ApiOperation({ summary: 'Creation category', description: 'Only for admin' })
  @ApiCommonResponse(CreatedCategoryDto)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CommonResponseDto<Category>> {
    const result: Category =
      await this.productService.createCategory(createCategoryDto);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get('categories')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Receiving all category',
    description: 'For admin and user',
  })
  @ApiCommonResponse(CreatedCategoryDto)
  async findAllCategories(): Promise<CommonResponseDto<Category[]>> {
    const result: Category[] = await this.productService.findAllCategories();
    return CommonResponse.succsessfully({ data: result });
  }

  @Get('categories/:id')
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
      await this.productService.findCategoryById(id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Put('categories/:id')
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
      await this.productService.updateCategory(id, updateCategoryDto);
    return;
  }

  @Delete('categories/:id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove category',
    description: 'For admin only, you can delete multiple categories at once ',
  })
  async removeCategory(@Param('id') id: number): Promise<any> {
    await this.productService.removeCategory(id);
    return;
  }

  @Delete(':id/files')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Removing the product files',
    description: 'If you an administartor, you can delete the product files',
  })
  async removeFileProduct(@Body() body: RemoveProductsDto): Promise<void> {
    const { ids } = body;
    await this.productService.removeFileProduct(ids);
    return;
  }

  @Post()
  @Roles('admin')
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('files', 10, { storage: FileService.storeg() }),
  )
  @ApiOperation({
    summary: 'Creation Product',
    description:
      'If you are an administrator, you can create an item. Do not forget to create a category and a discount before doing so (no discount required).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'product creation',
    type: CreateProductDto,
  })
  @ApiCommonResponse(CreateProductAnswerDto)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(FileService.validate())
    files: Array<Express.Multer.File>,
  ): Promise<
    CommonResponseDto<{
      product: Product;
      inventory: Inventory;
      images: File[];
    }>
  > {
    const result: {
      product: Product;
      inventory: Inventory;
      images: File[];
    } = await this.productService.createProduct(createProductDto, files);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get()
  @Roles('admin', 'user')
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('products')
  @CacheTTL(60 * 1000)
  @ApiOperation({
    summary: 'Receiving all products',
    description:
      'If you are a verified user or administrator, you get all the products. There is filtering of requests.',
  })
  @ApiCommonResponse(FindAllAnswerDto)
  async findAllProduct(
    @Query() queries: FindAllQueriesDto,
  ): Promise<CommonResponseDto<{ rows: Product[]; count: number }>> {
    const result: { rows: Product[]; count: number } =
      await this.productService.findAllProduct(queries);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get(':id')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({ summary: 'Product search by the id' })
  @ApiCommonResponse(FindOneProduct)
  async findProductById(
    @Param() params: FindOneDto,
  ): Promise<CommonResponseDto<Product | null>> {
    const { id } = params;
    const result: Product | null =
      await this.productService.findProductById(id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Post(':id/discount')
  @Roles('admin')
  @HttpCode(204)
  async applyDiscount(
    @Param() params: FindOneDto,
    @Body() applyDiscountDto: ApplyDiscountDto,
  ): Promise<void> {
    const { discountId } = applyDiscountDto;
    const { id } = params;
    const result = await this.productService.applyDiscount(id, discountId);
    return;
  }

  @Put(':id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Update Product',
    description: 'If you an administartor, you can update a product',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, { storage: FileService.storeg() }),
  )
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles(FileService.validate())
    files: Array<Express.Multer.File>,
  ): Promise<void> {
    const result: [affectedCount: number] =
      await this.productService.updateProduct(updateProductDto, files, id);
    return;
  }

  @Delete()
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Removing products',
    description: 'If you an administartor, you can delete products ',
  })
  async removeProduct(@Body() body: RemoveProductsDto): Promise<void> {
    const { ids } = body;
    await this.productService.removeProduct(ids);
    return;
  }
}
