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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user/currentUser.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { CreateAddressAnswerDto } from '../dto/create/create-address.api.dto';
import { CreateAddressUserDto } from '../dto/create/create-address.dto';
import { RemoveAddressesDto } from '../dto/remove/remove-address.dto';
import { Address } from '../entities/address.entity';
import { UserAddressService } from '../services/user-address.service';

@ApiBearerAuth()
@ApiExtraModels(CreateAddressAnswerDto)
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@ApiTags('User')
@UseGuards(RolesGuard)
@Controller('/user/:id')
export class UserController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post('/address')
  @Roles('user', 'admin')
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
  async createAddress(
    @CurrentUser('id') id: string,
    @Body() createAddressUserDto: CreateAddressUserDto,
  ): Promise<CommonResponseDto<Address>> {
    const result = await this.userAddressService.createAddress(
      createAddressUserDto,
      id,
    );
    return CommonResponse.succsessfully({ data: result });
  }

  @Get('/address')
  @Roles('user', 'admin')
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
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CreateAddressAnswerDto) },
            },
          },
        },
      ],
    },
  })
  async findAllAddress(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<Address[]>> {
    const result: Address[] = await this.userAddressService.findAllAddress(id);
    return CommonResponse.succsessfully({ data: result });
  }

  @Get('/address/:addressId')
  @Roles('user', 'admin')
  @ApiOperation({
    summary: 'Get one address by id',
    description: 'You can get one your addresses',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              items: { $ref: getSchemaPath(CreateAddressAnswerDto) },
            },
          },
        },
      ],
    },
  })
  @HttpCode(200)
  async findOneAddressById(
    @Param('addressId') addressId: number,
    @Param('id') id: number,
  ): Promise<CommonResponseDto<Address | null>> {
    const result: Address = await this.userAddressService.findOneAddressById(
      addressId,
      id,
    );
    return CommonResponse.succsessfully({ data: result });
  }

  @Patch('/address/:addressId')
  @HttpCode(204)
  @Roles('user', 'admin')
  @ApiOperation({
    summary: 'Edit an Address ',
    description:
      'The fields: city, country, street, house, postal code are mandatory. There can be no identical addresses ',
  })
  async updateAddress(
    @Body() createAddressUserDto: CreateAddressUserDto,
    @Param('addressId') addressId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const result: [affectedCount: number] =
      await this.userAddressService.updateAddress(
        createAddressUserDto,
        id,
        addressId,
      );
    return;
  }

  @Delete()
  @Roles('user', 'admin')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove an address ',
    description: 'You can delete one or more addresses',
  })
  async removeAddress(
    @Body() idsAddresses: RemoveAddressesDto,
    @Param('id') id: number,
  ): Promise<void> {
    const { ids } = idsAddresses;
    const result: number = await this.userAddressService.removeAddress(id, ids);
    return;
  }
}
