import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Queue } from 'bullmq';
import { MyLogger } from 'src/logger/logger.service';
import { CreateProductCommand } from '../commands/create/impl/create-product.command';
import { RemoveProductImagesCommand } from '../commands/removeImages/impl/remove-product-images.command';
import { UpdateProductCommand } from '../commands/update/impl/update-product.command';
import { CreateProductDto } from '../dto/create/create-product.dto';
import { FindAllQueriesDto } from '../dto/findAll/findAll-products.dto';
import { UpdateProductDto } from '../dto/update/update-product.dto';
import { File } from '../entities/file.entity';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { FindAllProductsQuery } from '../query/findAll/impl/find-all.query';
import { FindOneProductQuery } from '../query/findOne/impl/find-one-product.query';
import { ProductRepository } from '../repositories/product.repository';
import { SearchProductsQuery } from '../query/search/impl/search.query';

@Injectable()
export class ProductService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly productRepository: ProductRepository,
    private readonly logger: MyLogger,
    @InjectQueue('elastic') private queue: Queue,
  ) {}

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

    const job = await this.queue.add('product-indexing', product, {
      delay: 3000,
      attempts: 3,
      removeOnComplete: true,
    });
    return { product, inventory, images };
  }

  async findAllProduct(
    filtration: FindAllQueriesDto,
  ): Promise<{ products: Product[]; count: number }> {
    try {
      const result = await this.queryBus.execute(
        new FindAllProductsQuery(filtration),
      );
      return result;
    } catch (error) {
      this.logger.error(`Find all product ${error}`);
      throw new InternalServerErrorException('ServerError');
    }
  }

  async findProductById(id: number): Promise<Product | null> {
    try {
      const result = await this.queryBus.execute(new FindOneProductQuery(id));
      return result;
    } catch (error) {
      this.logger.error(`find one product Handler ${error}`);
      throw new InternalServerErrorException('Internal Server');
    }
  }

  async searchProducts(query: string): Promise<any> {
    return this.queryBus.execute(new SearchProductsQuery(query));
  }

  async updateProduct(
    updateProductDto: UpdateProductDto,
    files: Array<Express.Multer.File>,
    id: number,
  ): Promise<[affectedCount: number]> {
    try {
      const result = await this.commandBus.execute(
        new UpdateProductCommand(id, files, updateProductDto),
      );
      await this.queue.add(
        'product-updating',
        { id: id, name: updateProductDto.name, desc: updateProductDto.desc },
        {
          delay: 3000,
          attempts: 3,
          removeOnComplete: true,
        },
      );

      return result;
    } catch (error) {
      this.logger.error(`Product updating Handler ${error}`);
      throw new InternalServerErrorException('Internal Server');
    }
  }

  async removeProducts(ids: number[]): Promise<void> {
    try {
      await this.productRepository.removeProduct(ids);
      await this.queue.add(
        'product-removing',
        { ids },
        {
          delay: 3000,
          attempts: 3,
          removeOnComplete: true,
        },
      );
    } catch (error) {
      this.logger.error(`Product removing Handler ${error}`);
      throw new InternalServerErrorException('Internal Server');
    }
  }

  async removeFileProduct(ids: number[]): Promise<number> {
    try {
      return this.commandBus.execute(new RemoveProductImagesCommand(ids));
    } catch (error) {
      this.logger.error(`File removing Handler ${error}`);
      throw new InternalServerErrorException('Internal Server');
    }
  }
}
