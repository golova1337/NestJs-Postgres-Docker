import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from 'src/product/entities/category.entity';
import { CreateCategoryDto } from '../dto/category/create/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update/update-category.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    return this.categoryModel.create(data);
  }

  async findAllCategory(): Promise<Category[]> {
    return this.categoryModel.findAll({ include: [Product] });
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return this.categoryModel.findByPk(id, { include: [Product] });
  }

  async updateCategory(
    id: number,
    data: UpdateCategoryDto,
  ): Promise<[affectedCount: number]> {
    return this.categoryModel.update(data, { where: { id } });
  }

  async removeCategory(id: number): Promise<number> {
    return this.categoryModel.destroy({ where: { id: id } });
  }
}
