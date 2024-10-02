import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDiscountDto } from '../dto/create/create-discount.dto';
import { Discount } from '../entities/discount.entity';
import { DiscountRepository } from '../repositories/discount.repository';
import { UpdateDiscountDto } from '../dto/update/update-discount.dto';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class DiscountService {
  constructor(
    private readonly discountRepository: DiscountRepository,
    private readonly logger: MyLogger,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    return this.discountRepository.create(createDiscountDto).catch((error) => {
      this.logger.error(`Create Discount ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async findAll(): Promise<Discount[]> {
    return this.discountRepository.findAll().catch((error) => {
      this.logger.error(`Create Discount ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async findOne(id: number): Promise<Discount | null> {
    return this.discountRepository.findOne(id).catch((error) => {
      this.logger.error(`Create Discount ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
  }

  async update(
    id: number,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<void> {
    await this.discountRepository
      .update(id, updateDiscountDto)
      .catch((error) => {
        this.logger.error(`Create Discount ${error}`);
        throw new InternalServerErrorException('Server Error');
      });
    return;
  }

  async remove(ids: number[]): Promise<void> {
    await this.discountRepository.remove(ids).catch((error) => {
      this.logger.error(`Create Discount ${error}`);
      throw new InternalServerErrorException('Server Error');
    });
    return;
  }
}
