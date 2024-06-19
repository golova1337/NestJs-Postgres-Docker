import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  HttpCode,
  Query,
} from '@nestjs/common';
import { SingInAuthDto } from '../dto/create-auth.dto';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { RefreshTokenGuard } from 'src/common/guards/jwt/refreshToken.guard';
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { VerifyService } from '../services/verify.service';
import { RepeatSendCode } from '../dto/repeat-code.dto';
import { SendCodeService } from '../services/sendCode.service';
import { JwtTokenService } from '../services/jwt.service';
import { VerificationCode } from '../entities/verify.entity';

@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: 'Server Error' })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verifyService: VerifyService,
    private readonly sendCodeService: SendCodeService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

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

    const code: string = await this.verifyService.create(result.data.id);

    await this.sendCodeService.send({
      ...result.data.dataValues,
      code,
    });
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
  async logout(@CurrentUser('id') userId: string): Promise<void> {
    await this.authService.logout(+userId);
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
    const tokens: Result<{ accessToken: string; refreshToken: string }> =
      await this.authService.refresh(user);
    return Response.succsessfully(tokens);
  }

  @Get('verify')
  @HttpCode(204)
  @Public()
  @ApiOperation({
    summary: 'Verification account',
    description:
      'when you receive verification code you need to insert it in query and make request, then you can log In your account',
  })
  @ApiCreatedResponse({ status: 204 })
  @ApiQuery({ name: 'code' })
  async verify(@Query() query: { code: string }): Promise<void> {
    const verificationCode: VerificationCode =
      await this.verifyService.verify(query);
    await this.authService.isVerified(verificationCode.userId);
    await this.verifyService.remove(verificationCode.verificationCode);
    return;
  }

  @Get('/repeat')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Resend the verification code.',
    description: 'only for an account that has not been verified ',
  })
  @ApiCreatedResponse({ status: 204 })
  @Public()
  async repeatCode(@Body() body: RepeatSendCode): Promise<void> {
    const verificationCode: string = await this.verifyService.repeatCode(body);
    await this.sendCodeService.send({ ...body, code: verificationCode });
    return;
  }
}
