import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
} from '@nestjs/common';
import { SingInAuthDto } from '../dto/create-auth.dto';
import { User } from '../entities/user.entity';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { RefreshTokenGuard } from 'src/common/guards/jwt/refreshToken.guard';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public/public';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { JwtPayload } from '../../common/strategies/accessToken.strategy';
import { AuthService } from '../services/auth.service';
import { CommonResponse, Response, Result } from 'src/common/response/response';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: 'Server Error' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @Public()
  @ApiOperation({
    description:
      'You can register by email or by phone number. To register by email, delete the number field and change the registrationMethod to email. If you want to register by phone, remove the email field and change the registrationMethod to phone. When you submit your registration details you will receive a verification code (The code lives for 10 minutes), only after verifying your account you can log in. Verification with endpoint verify',
    summary: 'You can register by email or phone number',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 201 })
  async singIn(
    @Body() singInAuthDto: SingInAuthDto,
  ): Promise<CommonResponse<User>> {
    const result: Result<User> = await this.authService.create(singInAuthDto);
    return Response.succsessfully(result);
  }

  @Get()
  @ApiOperation({
    summary: 'Log in to your personal account.',
    description:
      "Enter email or numbers and specify registrationMethod for by email: 'email' , by numbers: 'phone'",
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
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
  @ApiOperation({
    summary: 'exit from the personal office.',
    description: "authorized users only ,don't forget to insert a JwT",
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ status: 204 })
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
  @ApiOperation({
    summary: 'Refres token',
    description: 'authorized users only',
  })
  @ApiCreatedResponse({ type: CommonResponse, status: 200 })
  @HttpCode(200)
  @ApiBearerAuth()
  async refresh(
    @Req() req: Request,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    const jwtPayload: JwtPayload = req['user'];

    const result: Result<{ accessToken: string; refreshToken: string }> =
      await this.authService.refresh(jwtPayload);
    return Response.succsessfully(result);
  }
}
