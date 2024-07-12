import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sort } from 'src/common/enum/sort-enum';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { CreateProductCommand } from '../commands/createProduct/impl/Create-product.command';
import { UpdateproductCommand } from '../commands/updateProduct/impl/Update-product.command';
import { ProductInventory } from '../entities/Product-inventory.entity';
import { Product } from '../entities/Product.entity';
import { SortBy } from '../enum/sort-by.enum';
import { FindAllProductsQuery } from '../queries/findAllProducts/impl/Find-all-products.query';
import { File } from '../entities/File.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(ProductInventory)
    private readonly productInventoryModel: typeof ProductInventory,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}
  async createProduct(
    createProduct: Omit<CreateProductCommand, 'quantity'>,
    quantity: string,
  ): Promise<{ product: Product; inventory: ProductInventory }> {
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();

    try {
      const inventory = await this.productInventoryModel.create(
        {
          quantity: quantity,
        },
        { transaction },
      );

      const product = await this.productModel.create(
        { ...createProduct, inventory_id: inventory.id },
        {
          transaction,
        },
      );
      await this.sequelizeTransactionRunner.commitTransaction(transaction);
      return { inventory, product };
    } catch (error) {
      await this.sequelizeTransactionRunner.rollbackTransaction(transaction);
    }
  }
  async findAll(
    query: FindAllProductsQuery,
  ): Promise<{ rows: Product[]; count: number }> {
    const { count, rows } = await this.productModel.findAndCountAll({
      where: {
        price: {
          [Op.between]: [
            query.price.minPrice || '0',
            query.price.maxPrice || 'infinity',
          ],
        },
      },
      offset: query.pagination.offset,
      limit: +query.pagination.perPage,
      order: [[query.order.sortBy || SortBy.Id, query.order.sort || Sort.ASC]],
      include: File,
    });
    return { count, rows };
  }
  async findByPk(id: number): Promise<Product | null> {
    return this.productModel.findByPk(id, { include: File });
  }
  async update(
    id: number,
    data: Omit<UpdateproductCommand, 'id'>,
  ): Promise<[affectedCount: number]> {
    return this.productModel.update(data, { where: { id: id } });
  }
  async updateCategory(
    id: number,
    category_id: string,
  ): Promise<[affectedCount: number]> {
    return this.productModel.update({ category_id }, { where: { id } });
  }

  async remove(ids: string[]): Promise<number> {
    return this.productModel.destroy({ where: { id: { [Op.in]: ids } } });
  }
}
