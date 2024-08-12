import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { CreateProductCommand } from '../commands/products/create/impl/create-product.command';
import { RemoveProductImagesCommand } from '../commands/products/removeImages/impl/remove-product-images.command';
import { UpdateProductCommand } from '../commands/products/update/impl/update-product.command';
import { CreateCategoryDto } from '../dto/category/create/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update/update-category.dto';
import { CreateProductDto } from '../dto/product/create/create-product.dto';
import { FindAllQueriesDto } from '../dto/product/findAll/findAll-products.dto';
import { UpdateProductDto } from '../dto/product/update/update-product.dto';
import { Category } from '../entities/category.entity';
import { File } from '../entities/file.entity';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { FindAllCommand } from '../query/product/findAll/impl/find-all.command';
import { CategoryRepository } from '../repositories/category.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ReviewRepository } from 'src/reviews/repositories/review.repository';

@Injectable()
export class ProductService {
  logger = new EmojiLogger();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name, desc } = createCategoryDto;
    return this.categoryRepository
      .createCategory(createCategoryDto)
      .catch((error) => {
        this.logger.error(`Create category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAllCategory().catch((error) => {
      this.logger.error(`Find All ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findCategoryById(id).catch((error) => {
      this.logger.error(`Find one category command ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<[affectedCount: number]> {
    return this.categoryRepository
      .updateCategory(id, updateCategoryDto)
      .catch((error) => {
        this.logger.error(`update category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async removeCategory(id: number): Promise<number> {
    return this.categoryRepository.removeCategory(id).catch((error) => {
      this.logger.error(`remove category command ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async createProduct(
    createProductDto: CreateProductDto,
    files: Array<Express.Multer.File>,
  ): Promise<{
    product: Product;
    inventory: Inventory;
    images: File[];
  }> {
    const { product, inventory, images } = await this.commandBus
      .execute(new CreateProductCommand(createProductDto, files))
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Internal Server');
      });
    return { product, inventory, images };
  }

  async findAllProduct(
    filtration: FindAllQueriesDto,
  ): Promise<{ products: Product[]; count: number }> {
    return this.queryBus
      .execute(new FindAllCommand(filtration))
      .catch((error) => {
        this.logger.error(`Find all product ${error}`);
        throw new InternalServerErrorException('ServerError');
      });
  }

  async findProductById(id: number): Promise<Product | null> {
    let [product, averageProductRating] = await Promise.all([
      this.productRepository.findProductById(id).catch((error) => {
        this.logger.error(`Error in findProductById: ${error}`);
        return null;
      }),
      this.reviewRepository.averageProductRating(id).catch((error) => {
        this.logger.error(`'Error in averageProductRating:', ${error}`);
        return 0;
      }),
      ,
    ]);

    product.dataValues.avgRating = averageProductRating['avgRating']
      ? averageProductRating['avgRating']
      : 0;

    return product;
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    files: Array<Express.Multer.File>,
    id: number,
  ): Promise<[affectedCount: number]> {
    // handler
    return this.commandBus
      .execute(new UpdateProductCommand(id, files, updateProductDto))
      .catch((error) => {
        this.logger.error(`Product removal Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }

  async removeProduct(ids: number[]): Promise<number> {
    return this.productRepository.removeProduct(ids).catch((error) => {
      this.logger.error(`Product files removal Handler ${error}`);
      throw new InternalServerErrorException('Internal Server');
    });
  }

  async removeFileProduct(ids: number[]): Promise<number> {
    return this.commandBus
      .execute(new RemoveProductImagesCommand(ids))
      .catch((error) => {
        this.logger.error(`Update Category Product Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }

  async applyDiscount(productId: number, discountId: number) {
    return this.productRepository.updateProduct(
      { discount_id: discountId },
      productId,
    );
  }
}
