import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateShoppingCartDto } from '../dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { ShoppingCartService } from '../services/shopping_cart.service';

@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('custom_key')
  @CacheTTL(60 * 1000)
  @Post('items')
  async addItem(@Body() createShoppingCartDto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(createShoppingCartDto);
  }

  @Get()
  getCartItems() {
    return this.shoppingCartService.findAll();
  }

  @Patch('items/:itemId')
  updateItem(
    @Param('id') id: string,
    @Body() updateShoppingCartDto: UpdateShoppingCartDto,
  ) {
    return this.shoppingCartService.update(+id, updateShoppingCartDto);
  }

  @Delete('items/:itemId')
  remove(@Param('id') id: string) {
    return this.shoppingCartService.remove(+id);
  }
}
