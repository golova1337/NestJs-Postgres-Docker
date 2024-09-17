import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { UpdateStatusOrderDto } from '../dto/update-order.dto';
import { CurrentUser } from 'src/common/decorators/user/currentUser.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

@ApiBearerAuth()
@ApiTags('Order')
@ApiExtraModels(CommonResponseDto)
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@UseGuards(RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles('admin', 'user')
  @HttpCode(201)
  @ApiOperation({ summary: 'Creation a order' })
  async create(
    @CurrentUser('id') userId: number,
  ): Promise<CommonResponseDto<{ order: Order; orderItems: OrderItem[] }>> {
    const result = await this.orderService.create(userId);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get()
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({ summary: 'Recieve all your orders' })
  async findAll(
    @CurrentUser('id') userId: number,
  ): Promise<CommonResponseDto<{ order: Order[]; orderItems: OrderItem[] }>> {
    const result = await this.orderService.findAll(userId);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get(':id')
  @Roles('admin', 'user')
  @HttpCode(200)
  @ApiOperation({ summary: 'Recieve one your order' })
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<{ order: Order; orderItems: OrderItem[] }>> {
    const result = await this.orderService.findOne(+id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Patch(':id')
  @Roles('admin')
  @HttpCode(204)
  @HttpCode(204)
  @ApiOperation({ summary: 'order status update for administrator only' })
  async update(
    @Param('id') id: number,
    @Body() updateStatusOrderDto: UpdateStatusOrderDto,
  ): Promise<void> {
    const result = await this.orderService.update(id, updateStatusOrderDto);
    return;
  }

  @Delete(':id')
  @Roles('admin', 'user')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a order by id' })
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.orderService.remove(id);
    return;
  }
}
