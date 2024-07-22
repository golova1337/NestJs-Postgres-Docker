import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { FiltrationUtils, PaginationResult } from 'src/utils/filtration';
import { CreateProductCommand } from '../commands/products/create/impl/create-product.command';
import { RemoveProductImagesCommand } from '../commands/products/removeImages/impl/remove-product-images.command';
import { RemoveProductsCommand } from '../commands/products/removeProduct/impl/remove-products.command';
import { CreateProductDto } from '../dto/product/create/create-product.dto';
import { File } from '../entities/file.entity';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { FindAllProductsQuery } from '../queries/products/findAll/impl/find-all-products.query';
import { FindOneProductQuery } from '../queries/products/findOne/impl/find-one-product.query';
import { UpdateProductCommand } from '../commands/products/update/impl/update-product.command';
import { CreateCategoryCommand } from 'src/product/commands/categories/create/impl/create-category.command';
import { FindOneCategoryQueryCommand } from 'src/product/queries/categories/findOne/impl/find-one-category.command';
import { UpdateCategoryCommand } from 'src/product/commands/categories/update/impl/update-category.command';
import { FindAllQueriesDto } from '../dto/product/findAll/findAll-products.dto';
import { UpdateProductDto } from '../dto/product/update/update-product.dto';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/category/create/create-category.dto';
import { FindAllCategoriesQuery } from '../queries/categories/findAll/impl/find-all-categories.command';
import { UpdateCategoryDto } from '../dto/category/update/update-category.dto';
import { RemoveCategoriesCommand } from '../commands/categories/remove/impl/remove-categories.command';

@Injectable()
export class ProductService {
  logger = new EmojiLogger();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    files: Array<Express.Multer.File>,
  ): Promise<{
    product: Product;
    inventory: Inventory;
    images: File[];
  }> {
    const { name, desc, discount_id, category_id, SKU, quantity, price } =
      createProductDto;

    const { product, inventory, images } = await this.commandBus
      .execute(
        new CreateProductCommand(
          name,
          desc,
          SKU,
          price,
          category_id,
          quantity,
          files,
          discount_id,
        ),
      )
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Internal Server');
      });
    return { product, inventory, images };
  }

  async findAllProduct(
    filtration: FindAllQueriesDto,
  ): Promise<{ rows: Product[]; count: number }> {
    // destructuring
    const { perPage, page, minPrice, maxPrice, sort, sortBy } = filtration;

    // pagination
    const pagination: PaginationResult = FiltrationUtils.pagination(
      page,
      perPage,
    );
    const price = { minPrice, maxPrice };
    const sorting = { sort, sortBy };

    // handler
    const products: { rows: Product[]; count: number } = await this.queryBus
      .execute(new FindAllProductsQuery(pagination, price, sorting))
      .catch((error) => {
        this.logger.error(`FindAll Query Command ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });

    return products;
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.queryBus.execute(new FindOneProductQuery(id)).catch((error) => {
      this.logger.error(`Find One Product Handler ${error}`);
      throw new InternalServerErrorException('Internal Server');
    });
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    files: Array<Express.Multer.File>,
    id: number,
  ): Promise<[affectedCount: number]> {
    //destructuring
    const {
      name,
      desc,
      discount_id,
      category_id,
      SKU,
      quantity,
      price,
      sign,
      changeQuantity,
    } = updateProductDto;

    // handler
    return this.commandBus
      .execute(
        new UpdateProductCommand(
          id,
          name,
          desc,
          SKU,
          price,
          category_id,
          quantity,
          files,
          discount_id,
          sign,
          changeQuantity,
        ),
      )
      .catch((error) => {
        this.logger.error(`Product removal Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }

  async removeProduct(ids: number[]): Promise<number> {
    return this.commandBus
      .execute(new RemoveProductsCommand(ids))
      .catch((error) => {
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

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name, desc } = createCategoryDto;
    return this.commandBus
      .execute(new CreateCategoryCommand(name, desc))
      .catch((error) => {
        this.logger.error(`Create category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findAllCategories(): Promise<Category[]> {
    return this.queryBus
      .execute(new FindAllCategoriesQuery())
      .catch((error) => {
        this.logger.error(`Find All ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return this.queryBus
      .execute(new FindOneCategoryQueryCommand(id))
      .catch((error) => {
        this.logger.error(`Find one category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<number> {
    return this.commandBus
      .execute(new UpdateCategoryCommand(id, updateCategoryDto))
      .catch((error) => {
        this.logger.error(`update category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async removeCategory(id: number): Promise<number> {
    return this.commandBus
      .execute(new RemoveCategoriesCommand(id))
      .catch((error) => {
        this.logger.error(`remove category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }
}
