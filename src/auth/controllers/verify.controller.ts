import { Body, Controller, Get, HttpCode, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/public/public';
import { VerifyService } from '../services/verify.service';
import { RepeatSendCode } from '../dto/repeat-code.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('verify')
@Controller('/verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}
  @Get()
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
    await this.verifyService.verify(query);
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
    console.log(body);

    await this.verifyService.repeatCode(body);
    return;
  }
}
