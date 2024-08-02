import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { DiscountController } from './controllers/discount.controller';
import { Discount } from './entities/discount.entity';
import { DiscountRepository } from './repositories/discount.repository';
import { DiscountService } from './services/discount.service';

export const Entities = [Discount];

export const Services = [DiscountService];

export const Repositories = [DiscountRepository];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities])],
  controllers: [DiscountController],
  providers: [...Services, ...Repositories],
})
export class DiscountModule {}
