import { Module } from '@nestjs/common';
import { DiscountController } from './controllers/discount.controller';
import { DiscountService } from './services/discount.service';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Discount } from './entities/discount.entity';
import { DiscountRepository } from './repositories/discount.repository';
import { CreateDiscountCommandHandler } from './commands/create/handlers/create-discount.command.handlers';
import { FindAllDiscountsQueryHandler } from './queries/findAll/handlers/find-all.query.handler';
import { FindOneDiscountQueryHandler } from './queries/findOne/handlers/find-one.query.handler';
import { UpdateDiscountCommandHandler } from './commands/update/handlers/update-discount.command.handler';
import { DeleteDiscountCommandHandler } from './commands/delete/handlers/delete-discount.command.handler';

export const Entities = [Discount];

export const Commands = [
  CreateDiscountCommandHandler,
  UpdateDiscountCommandHandler,
  DeleteDiscountCommandHandler,
];

export const Queris = [
  FindAllDiscountsQueryHandler,
  FindOneDiscountQueryHandler,
];

export const Services = [DiscountService];

export const Repositories = [DiscountRepository];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities])],
  controllers: [DiscountController],
  providers: [...Services, ...Commands, ...Queris, ...Repositories],
})
export class DiscountModule {}
