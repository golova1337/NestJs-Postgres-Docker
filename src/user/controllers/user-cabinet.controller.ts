import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Req,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateAddressUserDto } from '../dto/create-address.dto';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RemoveAccountDto } from 'src/auth/dto/remove-account.dto';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { CommonResponse, Response } from 'src/common/response/response';
import { UserAddress } from '../entities/address.entity';
import { UpdateEmailDto } from '../dto/update-email';

@UseGuards(RolesGuard)
@Controller('user/:id/cabinet')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('user', 'admin')
  @Post('address')
  async createAddress(
    @Param('id') id: string,
    @Body() address: CreateAddressUserDto,
  ): Promise<CommonResponse<UserAddress>> {
    const result: { data: UserAddress } = await this.userService.create(
      +id,
      address,
    );
    return Response.succsessfully(result);
  }

  @Roles('user', 'admin')
  @Patch('address/:addressId')
  async updateAddress(
    @Param('id') id: string,
    @Body() updateAddress: CreateAddressUserDto,
    @Param('addressId') addressId: string,
  ): Promise<CommonResponse<{ affectedCount: [affectedCount: number] }>> {
    const data = { id: +id, addressId: +addressId, updateAddress };
    const result: {
      data: { affectedCount: [affectedCount: number] };
    } = await this.userService.updateAddress(data);
    return Response.succsessfully(result);
  }

  @Roles('user', 'admin')
  @Patch('email')
  async updateEmail(
    @Param('id') id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<CommonResponse<{ affectedCount: [affectedCount: number] }>> {
    const result: {
      data: { affectedCount: [affectedCount: number] };
    } = await this.userService.updateEmail(+id, updateEmailDto);
    return Response.succsessfully(result);
  }

  @Roles('user', 'admin')
  @Delete('/remove-account')
  @HttpCode(204)
  async remove(
    @Req() req: Request,
    @Body() body: RemoveAccountDto,
  ): Promise<void> {
    const id = req['user']['id'];
    const password: string = body.password;
    await this.userService.remove(+id, password);
    return;
  }
}
