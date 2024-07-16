import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { FiltrationUtils, PaginationResult } from 'src/utils/filtration';
import { CreateProductCommand } from '../commands/createProduct/impl/Create-product.command';
import { RemoveProductImagesCommand } from '../commands/removeProductImages/impl/remove-product-images.command';
import { RemoveProductsCommand } from '../commands/removeProducts/impl/Remove-products.command';
import { UpdateCategoryCommand } from '../commands/updateCategory/impl/Update-category-product.command';
import { UpdateproductCommand } from '../commands/updateProduct/impl/Update-product.command';
import { UploadFilesCommand } from '../commands/uploadFiles/impl/Upload-files.command';
import { CreateProductDto } from '../dto/create/Create-product.dto';
import { FindAllQueriesDto } from '../dto/findAll/FindAll-products.dto';
import { UpdateProductDto } from '../dto/update/Update-product.dto';
import { File } from '../entities/File.entity';
import { ProductInventory } from '../entities/Product-inventory.entity';
import { Product } from '../entities/Product.entity';
import { FindAllProductsQuery } from '../queries/findAllProducts/impl/Find-all-products.query';
import { FindOneProductQuery } from '../queries/findOneProduct/impl/Find-one-product.query';

@Injectable()
export class ProductService {
  logger = new EmojiLogger();
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    author: string,
    files: Array<Express.Multer.File>,
  ): Promise<{
    product: Product;
    inventory: ProductInventory;
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
          author,
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
  async upload(
    files: Array<Express.Multer.File>,
    id: string,
    userId: string,
  ): Promise<File[]> {
    return this.commandBus
      .execute(new UploadFilesCommand(files, id, userId))
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Internal Server');
      });
  }

  async findAll(
    filtration: FindAllQueriesDto,
  ): Promise<{ rows: Product[]; count: number }> {
    const { perPage, page, minPrice, maxPrice, sort, sortBy } = filtration;
    const pagination: PaginationResult = FiltrationUtils.pagination(
      page,
      perPage,
    );
    const price = { minPrice, maxPrice };
    const sorting = { sort, sortBy };
    const products: { rows: Product[]; count: number } = await this.queryBus
      .execute(new FindAllProductsQuery(pagination, price, sorting))
      .catch((error) => {
        this.logger.error(`FindAll Query Command ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });

    return products;
  }

  async findOne(id: number): Promise<Product | null> {
    return this.queryBus.execute(new FindOneProductQuery(id)).catch((error) => {
      this.logger.error(`Find One Product Handler ${error}`);
      throw new InternalServerErrorException('Internal Server');
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<[affectedCount: number]> {
    const { name, desc, SKU, price } = updateProductDto;
    return this.commandBus
      .execute(new UpdateproductCommand(id, name, desc, SKU, price))
      .catch((error) => {
        this.logger.error(`Update Product Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }
  async updateCategory(
    id: number,
    categoria: string,
  ): Promise<[affectedCount: number]> {
    return this.commandBus
      .execute(new UpdateCategoryCommand(id, categoria))
      .catch((error) => {
        this.logger.error(`Update Category Product Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }

  async remove(ids: string[]): Promise<number> {
    return this.commandBus
      .execute(new RemoveProductsCommand(ids))
      .catch((error) => {
        this.logger.error(`Update Product Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }

  async removeImages(ids: string[]): Promise<number> {
    return this.commandBus
      .execute(new RemoveProductImagesCommand(ids))
      .catch((error) => {
        this.logger.error(`Update Category Product Handler ${error}`);
        throw new InternalServerErrorException('Internal Server');
      });
  }
}
