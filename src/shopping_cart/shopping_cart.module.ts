import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/product/entities/category.entity';
import { File } from 'src/product/entities/file.entity';
import { Inventory } from 'src/product/entities/inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { ShoppingCartController } from './controllers/shopping_cart.controller';
import { CheckProductConstraint } from './decorators/constraints/check-product';
import { FindManyProductsByIdsCommandHandler } from './queries/summary/handlers/summary.command.handler';
import { CartService } from './services/shopping_cart.service';

export const Entities = [Product, Inventory, File, Category];

export const Constraints = [CheckProductConstraint];

export const Queries = [FindManyProductsByIdsCommandHandler];

export const Repositories = [ProductRepository];

export const Sevicies = [CartService];
@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities])],
  controllers: [ShoppingCartController],
  providers: [...Sevicies, ...Queries, ...Repositories, ...Constraints],
})
export class ShoppingCartModule {}
