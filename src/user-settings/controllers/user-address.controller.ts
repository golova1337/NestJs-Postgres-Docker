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
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { CreateAddressUserDto } from '../dto/create/Create-address.dto';
import { RemoveAddressesDto } from '../dto/Remove-address.dto';
import { UserAddress } from '../entities/Address.entity';
import { UserAddressService } from '../services/User-address.service';
import { CommonResponseDto, Response } from 'src/common/response/response.dto';
import { CreateAddressAnswerDto } from '../dto/create/Create-address.api.dto';

@ApiBearerAuth()
@ApiExtraModels(CreateAddressAnswerDto)
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
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
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(CreateAddressAnswerDto),
            },
          },
        },
      ],
    },
  })
  async create(
    @CurrentUser('id') id: string,
    @Body() createAddressUserDto: CreateAddressUserDto,
  ): Promise<CommonResponseDto<UserAddress>> {
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
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(CreateAddressAnswerDto) },
            },
          },
        },
      ],
    },
  })
  async receive(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<UserAddress[]>> {
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
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(CreateAddressAnswerDto),
            },
          },
        },
      ],
    },
  })
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
