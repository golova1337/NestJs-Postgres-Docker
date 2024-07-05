import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { CommonResponse, Response } from 'src/common/response/response';
import { CreateProductDto } from '../dto/Create-product.dto';
import { FindAllDto } from '../dto/FindAll-products.dto';
import { RemoveProductsDto } from '../dto/Remove-product.dto';
import { UpdateProductCategoryDto } from '../dto/Update-product-category.dto';
import { UpdateProductDto } from '../dto/Update-product.dto';
import { ProductInventory } from '../entities/Product-inventory.entity';
import { Product } from '../entities/Product.entity';
import { ProductService } from '../services/product.service';

@ApiBearerAuth()
@ApiTags('Products')
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
  @ApiCreatedResponse({ type: CommonResponse, status: 201 })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<
    CommonResponse<{ product: Product; inventory: ProductInventory }>
  > {
    const result: { product: Product; inventory: ProductInventory } =
      await this.productService.create(createProductDto);
    return;
  }

  @Get()
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Receiving all products',
    description:
      'If you are a verified user or administrator, you get all the products. There is filtering of requests.',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
  async findAll(
    @Query() pagination: FindAllDto,
  ): Promise<CommonResponse<{ rows: Product[]; count: number }>> {
    const result: { rows: Product[]; count: number } =
      await this.productService.findAll(pagination);
    return Response.succsessfully({ data: result });
  }

  @Get(':id')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({ summary: 'Product search by the id' })
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponse<Product | null>> {
    const result: Product | null = await this.productService.findOne(+id);
    return Response.succsessfully({ data: result });
  }

  @Patch(':id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Update Product',
    description: 'If you an administartor, you can update product ',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 204 })
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
  @ApiCreatedResponse({ type: CommonResponse, status: 204 })
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
  @ApiCreatedResponse({ type: CommonResponse, status: 204 })
  async remove(@Body() body: RemoveProductsDto): Promise<number> {
    const ids = body.ids;
    return this.productService.remove(ids);
  }
}
