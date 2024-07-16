import { Injectable } from '@nestjs/common';
import { Category } from '../entities/Product-category.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryCommand } from '../commands/create/impl/Create-category.command';
import { UpdateCategory } from '../commands/update/impl/Update-category.command';
import { Op } from 'sequelize';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}
  async create(data: CreateCategoryCommand): Promise<Category> {
    return this.categoryModel.create(data);
  }
  async findAll(): Promise<Category[]> {
    return this.categoryModel.findAll();
  }
  async findOnePk(id: number): Promise<Category | null> {
    return this.categoryModel.findByPk(id);
  }
  async update(
    id: number,
    data: UpdateCategory,
  ): Promise<[affectedCount: number]> {
    return this.categoryModel.update(data, { where: { id } });
  }
  async remove(ids: string[]): Promise<number> {
    return this.categoryModel.destroy({ where: { id: { [Op.in]: ids } } });
  }
}
