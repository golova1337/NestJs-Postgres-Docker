import { Injectable } from '@nestjs/common';
import { Discount } from '../entities/discount.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDiscountCommand } from '../commands/create/impl/create-discount.command';
import { Op } from 'sequelize';
import { UpdateDiscountDto } from '../dto/update-discount.dto';

@Injectable()
export class DiscountRepository {
  constructor(
    @InjectModel(Discount)
    private discountModel: typeof Discount,
  ) {}

  async create(command: CreateDiscountCommand): Promise<Discount> {
    return this.discountModel.create(command);
  }

  async findAll(name): Promise<Discount[]> {
    return this.discountModel.findAll({
      where: { name: { [Op.like]: `%${name}%` } },
    });
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
