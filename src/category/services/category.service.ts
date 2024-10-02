import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from 'src/category/dto/category/create/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/category/update/update-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { MyLogger } from 'src/logger/logger.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: MyLogger,
  ) {}
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryRepository
      .createCategory(createCategoryDto)
      .catch((error) => {
        this.logger.error(`Create category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAllCategory().catch((error) => {
      this.logger.error(`Find All ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findCategoryById(id).catch((error) => {
      this.logger.error(`Find one category command ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<[affectedCount: number]> {
    return this.categoryRepository
      .updateCategory(id, updateCategoryDto)
      .catch((error) => {
        this.logger.error(`update category command ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
  }

  async removeCategory(id: number): Promise<number> {
    return this.categoryRepository.removeCategory(id).catch((error) => {
      this.logger.error(`remove category command ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }
}
