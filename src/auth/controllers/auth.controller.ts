import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { SingInAuthDto } from '../dto/create-auth.dto';
import { User } from '../entities/user.entity';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { RefreshTokenGuard } from 'src/common/guards/jwt/refreshToken.guard';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public/public';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RemoveAccountDto } from '../dto/remove-account.dto';
import { JwtPayload } from '../../common/strategies/accessToken.strategy';
import { AuthService } from '../services/auth.service';
import { CommonResponse, Response, Result } from 'src/common/response/response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @Public()
  async singIn(
    @Body() singInAuthDto: SingInAuthDto,
  ): Promise<CommonResponse<User>> {
    const result: Result<User> = await this.authService.create(singInAuthDto);
    return Response.succsessfully(result);
  }

  @Get()
  @HttpCode(200)
  @Public()
  async login(
    @Req() req: Request,
    @Body() loginAuthDto: LoginAuthDto,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    const result: Result<{ accessToken: string; refreshToken: string }> =
      await this.authService.login(loginAuthDto);
    return Response.succsessfully(result);
  }

  @HttpCode(204)
  @Patch('/logout')
  @Roles('user', 'admin')
  @UseGuards(RolesGuard)
  async logout(@Req() req: Request): Promise<void> {
    const userId: number = req['user']['id'];
    await this.authService.logout(userId);
    return;
  }

  @Patch('/refresh')
  @Public()
  @Roles('user', 'admin')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    const jwtPayload: JwtPayload = req['user'];

    const result: Result<{ accessToken: string; refreshToken: string }> =
      await this.authService.refresh(jwtPayload);
    return Response.succsessfully(result);
  }

  @Delete('/remove-account')
  @Roles('user', 'admin')
  @UseGuards(RolesGuard)
  @HttpCode(204)
  async remove(
    @Req() req: Request,
    @Body() body: RemoveAccountDto,
  ): Promise<void> {
    const id = req['user']['id'];
    const password: string = body.password;
    await this.authService.remove(+id, password);
    return;
  }
}
