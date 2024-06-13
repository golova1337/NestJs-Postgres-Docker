import { Body, Controller, Get, HttpCode, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/public/public';
import { VerifyService } from '../services/verify.service';
import { RepeatSendCode } from '../dto/repeat-code.dto';

@Controller('/verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}
  @Get()
  @HttpCode(204)
  @Public()
  async verify(@Query() query: { code: string }): Promise<void> {
    await this.verifyService.verify(query);
    return;
  }

  @Get('/repeat')
  @HttpCode(204)
  @Public()
  async repeatCode(@Body() body: RepeatSendCode): Promise<void> {
    console.log(body);

    await this.verifyService.repeatCode(body);
    return;
  }
}
