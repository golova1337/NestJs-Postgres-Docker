import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sort } from 'src/common/enum/sort-enum';
import { Discount } from 'src/discount/entities/discount.entity';
import { CreateProductDto } from '../dto/product/create/create-product.dto';
import { Category } from '../entities/category.entity';
import { File } from '../entities/file.entity';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { SortBy } from '../enum/sort-by.enum';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async createProduct(
    product: Omit<CreateProductDto, 'quantity' | 'files'>,
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

  async findAllProduct({
    pagination,
    price,
    order,
  }): Promise<{ rows: Product[]; count: number }> {
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

  async findProductById(
    id: number,
    transaction?: Transaction,
  ): Promise<Product | null> {
    return this.productModel.findByPk(id, {
      include: [File, Inventory, Category, Discount],
      transaction: transaction,
    });
  }

  async findManyProductsByIds(
    ids: number[],
    transaction?: Transaction,
  ): Promise<Product[]> {
    return this.productModel.findAll({
      where: { id: { [Op.in]: ids } },
      include: [File, Inventory, Category, Discount],
      transaction: transaction,
    });
  }

  async updateProduct(
    data: any,
    id: number,
    transaction?: Transaction,
  ): Promise<[affectedCount: number]> {
    return this.productModel.update(data, { where: { id: id }, transaction });
  }

  async removeProduct(ids: number[]): Promise<number> {
    return this.productModel.destroy({ where: { id: { [Op.in]: ids } } });
  }
}
