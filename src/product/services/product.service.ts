import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { FiltrationUtils, PaginationResult } from 'src/utils/filtration';
import { CreateProductCommand } from '../commands/createProduct/impl/Create-product.command';
import { RemoveProductsCommand } from '../commands/removeProducts/impl/Remove-products.command';
import { UpdateproductCommand } from '../commands/updateProduct/impl/Update-product.command';
import { CreateProductDto } from '../dto/Create-product.dto';
import { FindAllDto } from '../dto/FindAll-products.dto';
import { UpdateProductDto } from '../dto/Update-product.dto';
import { ProductInventory } from '../entities/Product-inventory.entity';
import { Product } from '../entities/Product.entity';
import { FindAllProductsQuery } from '../queries/findAllProducts/impl/Find-all-products.query';
import { FindOneProductQuery } from '../queries/findOneProduct/impl/Find-one-product.query';
import { UpdateCategoryProductCommand } from '../commands/updateCategory/impl/Update-category-product.command';

@Injectable()
export class ProductService {
  logger = new EmojiLogger();
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async create(
    createProductDto: CreateProductDto,
  ): Promise<{ product: Product; inventory: ProductInventory }> {
    const { name, desc, discount_id, category_id, SKU, quantity, price } =
      createProductDto;

    const { product, inventory } = await this.commandBus
      .execute(
        new CreateProductCommand(
          name,
          desc,
          SKU,
          price,
          category_id,
          quantity,
          discount_id,
        ),
      )
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException('Internal Server');
      });
    return { product, inventory };
  }

  async findAll(
    filtration: FindAllDto,
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
      .execute(new UpdateCategoryProductCommand(id, categoria))
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
}
