import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { CreateDiscountDto } from '../dto/create/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { Discount } from '../entities/discount.entity';
import { DiscountService } from '../services/discount.service';
import { DeleteDiscountDto } from '../dto/delete-discount.dto';
import { ApiCommonResponse } from 'src/common/decorators/apiSchemas/commonResponse';
import { DiscountApiDto } from '../dto/create/create-discount.api';
import { FindAllDiscounts } from '../dto/findAll/find-all.api.dto';

@ApiBearerAuth()
@ApiTags('Discounts')
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@UseGuards(RolesGuard)
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Roles('admin')
  @HttpCode(201)
  @ApiOperation({ summary: 'An admin can create a discount' })
  @ApiCommonResponse(DiscountApiDto)
  async create(
    @Body() createDiscountDto: CreateDiscountDto,
  ): Promise<CommonResponseDto<Discount>> {
    const result = await this.discountService.create(createDiscountDto);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Receive all discounts' })
  @HttpCode(200)
  @ApiCommonResponse(FindAllDiscounts)
  async findAll(
    @Query('name') name?: string,
  ): Promise<CommonResponseDto<{ discounts: Discount[] }>> {
    const result = await this.discountService.findAll(name);
    return CommonResponse.succsessfully({ data: { discounts: result } });
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Receive one a discount' })
  @HttpCode(200)
  @ApiCommonResponse(DiscountApiDto)
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<Discount | null>> {
    const result = await this.discountService.findOne(+id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Patch(':id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({ summary: 'An admin can update a discount data' })
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<void> {
    const result = await this.discountService.update(+id, updateDiscountDto);
    return;
  }

  @Delete()
  @Roles('admin')
  @ApiOperation({ summary: 'An admin can remove a discount' })
  @HttpCode(204)
  async remove(@Body() body: DeleteDiscountDto): Promise<void> {
    const { ids } = body;
    await this.discountService.remove(ids);
    return;
  }
}
