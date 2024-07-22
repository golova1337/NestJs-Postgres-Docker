import { PartialType } from '@nestjs/swagger';
import { CreateShoppingCartDto } from './create-shopping_cart.dto';

export class UpdateShoppingCartDto extends PartialType(CreateShoppingCartDto) {}
