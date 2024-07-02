import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public/public';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { RefreshTokenGuard } from 'src/common/guards/jwt/refreshToken.guard';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { CommonResponse, Response } from 'src/common/response/response';
import { JwtPayload } from '../../common/strategies/accessToken.strategy';
import { SingInAuthDto } from '../dto/create-auth.dto';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { RepeatSendCode } from '../dto/repeat-code.dto';
import { User } from '../entities/User.entity';

import { AuthService } from '../services/Auth.service';

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
    const result: User = await this.authService.singIn(singInAuthDto);
    return Response.succsessfully({ data: result });
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
    @Body() loginAuthDto: LoginAuthDto,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    const result: { accessToken: string; refreshToken: string } =
      await this.authService.login(loginAuthDto);
    return Response.succsessfully({ data: result });
  }

  @Patch('/logout')
  @HttpCode(204)
  @ApiOperation({
    summary: 'exit from the personal office.',
    description: "authorized users only ,don't forget to insert a JwT",
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ status: 204 })
  @Roles('user', 'admin')
  @UseGuards(RolesGuard)
  async logout(@CurrentUser('id') userId: string): Promise<void> {
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
    @CurrentUser() user: JwtPayload,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    const result: { accessToken: string; refreshToken: string } =
      await this.authService.refresh(user);
    return Response.succsessfully({ data: result });
  }

  @Patch('verify')
  @HttpCode(204)
  @Public()
  @ApiOperation({
    summary: 'Verification account',
    description:
      'when you receive verification code you need to insert it in query and make request, then you can log In your account',
  })
  @ApiCreatedResponse({ status: 204 })
  @ApiQuery({ name: 'otp' })
  async verify(@Query('otp') otp: string): Promise<void> {
    await this.authService.verify(otp);
    return;
  }

  @Post('/repeat')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Resend the verification code.',
    description: 'only for an account that has not been verified ',
  })
  @ApiCreatedResponse({ status: 204 })
  @Public()
  async repeatCode(@Body() repeatSendCode: RepeatSendCode): Promise<void> {
    await this.authService.repeatCode(repeatSendCode);
    return;
  }
}
