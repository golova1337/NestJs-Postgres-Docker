import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { CommonResponse, Response } from 'src/common/response/response';
import { AddressService } from '../services/address.service';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CreateAddressUserDto } from '../dto/create-address.dto';
import { UserAddress } from '../entities/address.entity';
import { RemoveAddressesDto } from '../dto/remove-address.dto';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('User-Address')
@UseGuards(RolesGuard)
@Controller('user/:id/cabinet/address')
export class UserPersonalDataController {
  constructor(private readonly addressService: AddressService) {}
  @Roles('user', 'admin')
  @Post()
  @ApiOperation({
    summary: 'Address creation',
    description:
      'You can create default delivery addresses. The fields: city, country, street, house, postal code are mandatory. There can be no identical addresses ',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 201 })
  async create(
    @Param('id') id: string,
    @Body() address: CreateAddressUserDto,
  ): Promise<CommonResponse<UserAddress>> {
    const result: { data: UserAddress } =
      await this.addressService.createAddress(+id, address);
    return Response.succsessfully(result);
  }

  @Roles('user', 'admin')
  @Patch(':addressId')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Edit an Address ',
    description:
      'The fields: city, country, street, house, postal code are mandatory. There can be no identical addresses ',
  })
  @ApiCreatedResponse({ status: 204 })
  async update(
    @Param('id') id: string,
    @Body() updateAddress: CreateAddressUserDto,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    const data = { id: +id, addressId: +addressId, updateAddress };
    await this.addressService.updateAddress(data);
    return;
  }

  @Roles('user', 'admin')
  @Delete()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove an address ',
    description: 'You can delete one or more addresses',
  })
  async remove(
    @Body() body: RemoveAddressesDto,
    @Req() req: Request,
  ): Promise<void> {
    const ids: string[] = body.ids;
    const userId = req['user']['id'];
    await this.addressService.remove({ ids, userId });
    return;
  }
}
