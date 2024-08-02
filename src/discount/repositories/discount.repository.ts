import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Discount } from '../entities/discount.entity';
import { CreateDiscountDto } from '../dto/create/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update/update-discount.dto';

@Injectable()
export class DiscountRepository {
  constructor(
    @InjectModel(Discount)
    private discountModel: typeof Discount,
  ) {}

  async create(data: CreateDiscountDto): Promise<Discount> {
    return this.discountModel.create(data);
  }

  async findAll(): Promise<Discount[]> {
    return this.discountModel.findAll();
  }

  async findOne(id: number): Promise<Discount | null> {
    return this.discountModel.findByPk(id);
  }

  async update(
    id: number,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<[affectedCount: number]> {
    return this.discountModel.update(updateDiscountDto, { where: { id: id } });
  }

  async remove(ids: number[]): Promise<number> {
    return this.discountModel.destroy({ where: { id: { [Op.in]: ids } } });
  }
}
