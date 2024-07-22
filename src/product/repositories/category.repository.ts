import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateCategoryCommand } from 'src/product/commands/categories/create/impl/create-category.command';
import { UpdateCategory } from 'src/product/commands/categories/update/impl/update-category.command';
import { Category } from 'src/product/entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}
  async createCategory(data: CreateCategoryCommand): Promise<Category> {
    return this.categoryModel.create(data);
  }
  async findAllCategory(): Promise<Category[]> {
    return this.categoryModel.findAll();
  }
  async findCategoryById(id: number): Promise<Category | null> {
    return this.categoryModel.findByPk(id);
  }
  async updateCategory(
    id: number,
    data: UpdateCategory,
  ): Promise<[affectedCount: number]> {
    return this.categoryModel.update(data, { where: { id } });
  }
  async removeCategory(id: number): Promise<number> {
    return this.categoryModel.destroy({ where: { id: id } });
  }
}
