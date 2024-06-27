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
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { CommonResponse, Response } from 'src/common/response/response';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CreateAddressUserDto } from '../dto/create-address.dto';
import { UserAddress } from '../entities/address.entity';
import { RemoveAddressesDto } from '../dto/remove-address.dto';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { CreateAddressCommand } from '../commands/address/create/Create-address.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RecieveAddressQuery } from '../queries/address/recieve/Recieve-address.query';
import { UpdateAddressCommand } from '../commands/address/update/Update-address.command';
import { RemoveAddressCommand } from '../commands/address/remove/Remove-address.command';

@ApiBearerAuth()
@ApiTags('User-Address')
@UseGuards(RolesGuard)
@Controller(':id/address')
export class UserAddressController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles('user', 'admin')
  @Post()
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
    const { country, city, street, house, apartment, postal_code, phone } =
      createAddressUserDto;
    const result: { data: UserAddress } = await this.commandBus.execute(
      new CreateAddressCommand(
        id,
        country,
        city,
        street,
        postal_code,
        house,
        apartment,
        phone,
      ),
    );
    return Response.succsessfully(result);
  }

  @Roles('user', 'admin')
  @Get()
  async receive(
    @Param('id') id: string,
  ): Promise<CommonResponse<UserAddress[]>> {
    const result = await this.queryBus.execute(new RecieveAddressQuery(id));
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
    @Body() createAddressUserDto: CreateAddressUserDto,
    @Param('addressId') addressId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const { country, city, street, house, apartment, postal_code, phone } =
      createAddressUserDto;
    await this.commandBus.execute(
      new UpdateAddressCommand(
        id,
        addressId,
        country,
        city,
        street,
        postal_code,
        house,
        apartment,
        phone,
      ),
    );
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
    @Body() ids: RemoveAddressesDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.commandBus.execute(new RemoveAddressCommand(id, ids.ids));
    return;
  }
}
