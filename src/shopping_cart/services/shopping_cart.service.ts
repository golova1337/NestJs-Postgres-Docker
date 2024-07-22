import { Inject, Injectable } from '@nestjs/common';
import { CreateShoppingCartDto } from '../dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from '../dto/update-shopping_cart.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ShoppingCartService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(createShoppingCartDto: CreateShoppingCartDto) {
    console.log('in the service');
    // const cahe = 

    return 'hello';
  }

  findAll() {
    return `This action returns all shoppingCart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoppingCart`;
  }

  update(id: number, updateShoppingCartDto: UpdateShoppingCartDto) {
    return `This action updates a #${id} shoppingCart`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingCart`;
  }
}
