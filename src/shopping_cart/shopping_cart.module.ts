import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Commands } from './commands';
import { ShoppingCartController } from './controllers/shopping_cart.controller';
import { Constraints } from './decorators/constraints';
import { Entities } from './entities';
import { Helpers } from './helpers';
import { Queries } from './queries';
import { Repositories } from './repositories';
import { Sevicies } from './services';

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([...Entities])],
  controllers: [ShoppingCartController],
  providers: [
    ...Sevicies,
    ...Queries,
    ...Repositories,
    ...Constraints,
    ...Helpers,
    ...Commands,
  ],
})
export class ShoppingCartModule {}
