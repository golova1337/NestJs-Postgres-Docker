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
import { CommonResponse, Response, Result } from 'src/common/response/response';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/User.entity';
import { CurrentUser } from 'src/common/decorators/user/сurrentUser.decorator';
import { RepeatSendCode } from '../dto/repeat-code.dto';
import { SendCodeService } from '../services/sendCode.service';
import { Otp } from '../entities/Otp.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCreateJwtQuery } from '../queries/login/Login-create-jwt.query';
import { LoginCheckUserQuery } from '../queries/login/Login-check-user.query';
import { LogoutCommand } from '../commands/logout/Logout.command';
import { RefreshCommand } from '../commands/refresh/Refresh.command';
import { IsVerifiedCommand } from '../commands/verify-otp/IsVerified.command';
import { CheckOtpCommand } from '../commands/verify-otp/Check-verification-code.command';
import { SingInCreateUserCommand } from '../commands/singIn/Sing-in-create-user.command';
import { SingInCreateOtpCommand } from '../commands/singIn/Sing-in-create-verification.command';
import { RemoveOtpCommand } from '../commands/verify-otp/Remove-verification-code.command';
import { RepeatSendOtpCommand } from '../commands/repeat-otp/Repeat-otp.command';

@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: 'Server Error' })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendCodeService: SendCodeService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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
    const { registrationMethod, password, name, lastname, email, phone } =
      singInAuthDto;
    // creation new user
    const user: User = await this.commandBus.execute(
      new SingInCreateUserCommand(
        registrationMethod,
        password,
        name,
        lastname,
        email,
        phone,
      ),
    );
    // creating otp that will be saved in the database
    const otp: string = await this.commandBus.execute(
      new SingInCreateOtpCommand(user.id, email, phone, registrationMethod),
    );
    //running a service that adds a massage to the massage queue
    this.sendCodeService.send({ registrationMethod, email, phone, otp });
    return Response.succsessfully({ data: user });
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
    const { registrationMethod, email, phone, password } = loginAuthDto;
    //get user by email or phone, compare password
    const user: User = await this.queryBus.execute(
      new LoginCheckUserQuery(registrationMethod, phone, email, password),
    );
    // tokens creation
    const tokens: {
      data: { accessToken: string; refreshToken: string };
    } = await this.queryBus.execute(
      new LoginCreateJwtQuery(user.id, user.role),
    );
    return Response.succsessfully(tokens);
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
    // refresh token removal
    await this.commandBus.execute(new LogoutCommand(+userId));
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
    const { id, role, refreshToken } = user;
    // tokens creation
    const tokens: Result<{ accessToken: string; refreshToken: string }> =
      await this.commandBus.execute(new RefreshCommand(id, role, refreshToken));
    return Response.succsessfully(tokens);
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
    // check otp
    const verificationCode: Otp = await this.commandBus.execute(
      new CheckOtpCommand(otp),
    );
    // update a user in the database, making it verified
    await this.commandBus.execute(
      new IsVerifiedCommand(verificationCode.userId),
    );
    // remove Otp
    await this.commandBus.execute(new RemoveOtpCommand(verificationCode.otp));
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
    const { registrationMethod, email, phone } = repeatSendCode;
    const otp = await this.commandBus.execute(
      new RepeatSendOtpCommand(registrationMethod, email, phone),
    );

    await this.sendCodeService.send({ ...repeatSendCode, otp });
    return;
  }
}
