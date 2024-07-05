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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { CommonResponse, Response } from 'src/common/response/response';
import { CreateAddressUserDto } from '../dto/Create-address.dto';
import { RemoveAddressesDto } from '../dto/Remove-address.dto';
import { UserAddress } from '../entities/Address.entity';
import { UserAddressService } from '../services/User-address.service';

@ApiBearerAuth()
@ApiTags('User-Address')
@UseGuards(RolesGuard)
@Controller(':id/address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Roles('user', 'admin')
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Address creation',
    description:
      'You can create default delivery addresses. The fields: city, country, street, house, postal code are mandatory. There can be no identical addresses ',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 201 })
  async create(
    @CurrentUser('id') id: string,
    @Body() createAddressUserDto: CreateAddressUserDto,
  ): Promise<CommonResponse<UserAddress>> {
    const result = await this.userAddressService.create(
      createAddressUserDto,
      id,
    );
    return Response.succsessfully({ data: result });
  }

  @Roles('user', 'admin')
  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all the addresses',
    description: 'You can get all your addresses',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
  async receive(
    @Param('id') id: string,
  ): Promise<CommonResponse<UserAddress[]>> {
    const result: UserAddress[] = await this.userAddressService.receive(id);
    return Response.succsessfully({ data: result });
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
    @Body() createAddressUserDto: CreateAddressUserDto,
    @Param('addressId') addressId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.userAddressService.update(createAddressUserDto, id, addressId);
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
    @Body() idsAddresses: RemoveAddressesDto,
    @Param('id') id: string,
  ): Promise<void> {
    const { ids } = idsAddresses;
    await this.userAddressService.remove(id, ids);
    return;
  }
}
