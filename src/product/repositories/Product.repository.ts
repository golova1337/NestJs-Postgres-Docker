import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sort } from 'src/common/enum/sort-enum';
import { CreateProductCommand } from '../commands/products/create/impl/create-product.command';
import { File } from '../entities/file.entity';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { SortBy } from '../enum/sort-by.enum';
import { FindAllProductsQuery } from '../queries/products/findAll/impl/find-all-products.query';
import { UpdateProductCommand } from '../commands/products/update/impl/update-product.command';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async createProduct(
    product: Omit<CreateProductCommand, 'quantity' | 'files'>,
    inventory_id: number,
    transaction?: Transaction,
  ): Promise<Product> {
    return this.productModel.create(
      { ...product, inventory_id: inventory_id },
      {
        transaction,
      },
    );
  }

  async findAllProduct(
    query: FindAllProductsQuery,
  ): Promise<{ rows: Product[]; count: number }> {
    const { pagination, price, order } = query;
    const { count, rows } = await this.productModel.findAndCountAll({
      where: {
        price: {
          [Op.between]: [price.minPrice || 0, price.maxPrice || 'infinity'],
        },
      },
      offset: pagination.offset,
      limit: pagination.perPage,
      order: [[order.sortBy || SortBy.Id, order.sort || Sort.ASC]],
      include: File,
    });
    return { count, rows };
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.productModel.findByPk(id, {
      include: [File, Inventory, Category],
    });
  }

  async updateProduct(
    data: Omit<
      UpdateProductCommand,
      'files' | 'id' | 'quantity' | 'sign' | 'changeQuantity'
    >,
    id: number,
    transaction?: Transaction,
  ): Promise<[affectedCount: number]> {
    return this.productModel.update(data, { where: { id: id }, transaction });
  }

  async removeProduct(ids: number[]): Promise<number> {
    return this.productModel.destroy({ where: { id: { [Op.in]: ids } } });
  }
}
