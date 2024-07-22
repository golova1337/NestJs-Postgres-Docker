import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCartController } from './controllers/shopping_cart.controller';
import { CartItem } from './entities/cart-item.entity';
import { ShoppingSession } from './entities/shopping-session.entity';
import { ShoppingCartService } from './services/shopping_cart.service';
export const Shopping = [ShoppingSession, CartItem];
@Module({
  imports: [SequelizeModule.forFeature([...Shopping])],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
