import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Query,
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
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public/public';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { RefreshTokenGuard } from 'src/common/guards/jwt/refreshToken.guard';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import { JwtPayload } from '../../common/strategies/accessToken.strategy';
import { RepeatSendCode } from '../dto/rapeatCode/Repeat-code.dto';
import { User } from '../entities/User.entity';

import { CommonResponseDto, Response } from 'src/common/response/response.dto';
import { SingInAuthDto } from '../dto/create/create-auth.dto';
import { SingInAuthAnswerDto } from '../dto/create/create-auth.dto.api';
import { LoginAuthAnswerDto } from '../dto/login/login-api.dto';
import { LoginAuthDto } from '../dto/login/login-auth.dto';
import { AuthService } from '../services/Auth.service';

@ApiTags('Auth')
@ApiExtraModels(SingInAuthAnswerDto, LoginAuthAnswerDto)
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
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
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(SingInAuthAnswerDto),
            },
          },
        },
      ],
    },
  })
  async singIn(
    @Body() singInAuthDto: SingInAuthDto,
  ): Promise<CommonResponseDto<SingInAuthAnswerDto>> {
    const result: User = await this.authService.singIn(singInAuthDto);
    return Response.succsessfully({ data: result });
  }

  @Post('/login')
  @HttpCode(200)
  @Public()
  @ApiOperation({
    summary: 'Log in to your personal account.',
    description:
      "Enter email or numbers and specify registrationMethod for by email: 'email' , by numbers: 'phone'",
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(LoginAuthAnswerDto),
            },
          },
        },
      ],
    },
  })
  async login(
    @Body() loginAuthDto: LoginAuthDto,
  ): Promise<CommonResponseDto<LoginAuthAnswerDto>> {
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
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(LoginAuthAnswerDto),
            },
          },
        },
      ],
    },
  })
  @HttpCode(200)
  @ApiBearerAuth()
  async refresh(
    @CurrentUser() user: JwtPayload,
  ): Promise<CommonResponseDto<LoginAuthAnswerDto>> {
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
  @Public()
  async repeatCode(@Body() repeatSendCode: RepeatSendCode): Promise<void> {
    await this.authService.repeatCode(repeatSendCode);
    return;
  }
}
