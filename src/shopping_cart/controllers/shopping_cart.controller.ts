import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { ApiCommonResponse } from 'src/common/decorators/apiSchemas/commonResponse';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user/currentUser.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { ShoppingCartDto } from '../dto/apiResponse/summary';
import { CreateCartItemDto } from '../dto/create-shopping_cart.dto';
import { UpdateItemDto } from '../dto/update-shopping_cart.dto';
import { CartService } from '../services/shopping_cart.service';

@ApiBearerAuth()
@ApiTags('Shopping Cart')
@ApiExtraModels(CommonResponseDto)
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@UseGuards(RolesGuard)
@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @Roles('admin', 'user')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Adding an item to shopping cart',
  })
  async addItem(
    @Body() createCartItemDto: CreateCartItemDto,
    @CurrentUser('id') id: number,
  ): Promise<void> {
    await this.cartService.addItem(createCartItemDto, id);
    return;
  }

  @Get('summary')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Receiving full a cart to review',
  })
  @ApiCommonResponse(ShoppingCartDto)
  async getCartItems(@CurrentUser('id') id: number) {
    const result = await this.cartService.summary(id);

    return CommonResponse.succsessfully({ data: result });
  }

  @Patch('update')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiCommonResponse(ShoppingCartDto)
  @ApiOperation({ summary: 'You can update items, add or remove' })
  async updateItem(
    @CurrentUser('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const result = await this.cartService.updateItem(id, updateItemDto);
    return CommonResponse.succsessfully({ data: result });
  }

  @Delete('items/:itemId')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({ summary: 'You can remove an item' })
  @ApiCommonResponse(ShoppingCartDto)
  async remove(
    @Param('itemId') itemId: number,
    @CurrentUser('id') userId: number,
  ) {
    const result = await this.cartService.removeItem(itemId, userId);
    return CommonResponse.succsessfully({ data: result });
  }
}
