import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/public/public';
import { VerifyService } from '../services/verify.service';

@Controller('/verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}
  @Get()
  @HttpCode(200)
  @Public()
  async verify(@Query() query: { code: string }) {
    const result = await this.verifyService.verify(query);
    return result;
  }
}
