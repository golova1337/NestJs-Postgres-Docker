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
  async create(
    @CurrentUser('id') userId: number,
  ): Promise<CommonResponseDto<{ order: Order; orderItems: OrderItem[] }>> {
    const result = await this.orderService.create(userId);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get()
  @Roles('admin', 'user')
  async findAll(
    @CurrentUser('id') userId: number,
  ): Promise<CommonResponseDto<{ order: Order[]; orderItems: OrderItem[] }>> {
    const result = await this.orderService.findAll(userId);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<{ order: Order; orderItems: OrderItem[] }>> {
    const result = await this.orderService.findOne(+id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Patch(':id')
  @Roles('admin')
  @HttpCode(204)
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
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.orderService.remove(id);
    return;
  }
}
