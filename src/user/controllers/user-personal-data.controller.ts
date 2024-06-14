import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RemoveAccountDto } from 'src/user/dto/remove-account.dto';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { UpdateEmailDto } from '../dto/update-email';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User-Personal-Date')
@UseGuards(RolesGuard)
@Controller('user/:id/cabinet')
export class AddressController {
  constructor(private readonly userService: UserService) {}

  @Roles('user', 'admin')
  @Patch('email')
  @ApiOperation({
    summary: 'Edit an email ',
    description: 'The field: mail. Do not forget change email ',
  })
  async updateEmail(
    @Param('id') id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<void> {
    await this.userService.updateEmail(+id, updateEmailDto);
    return;
  }

  @Roles('user', 'admin')
  @Delete('/remove-account')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove',
    description: 'The fields: password and passwordRepeat are mandatory ',
  })
  async removeAccount(
    @Req() req: Request,
    @Body() body: RemoveAccountDto,
    @Param('id') id: string,
  ): Promise<void> {
    const password: string = body.password;
    await this.userService.removeAccount(+id, password);
    return;
  }
}
