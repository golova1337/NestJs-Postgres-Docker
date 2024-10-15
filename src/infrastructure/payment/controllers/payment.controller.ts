import {
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ApiCommonResponse } from 'src/common/decorators/apiSchemas/commonResponse';
import { Public } from 'src/common/decorators/public/public.decorator';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/role.guard';
import {
  CommonResponse,
  CommonResponseDto,
} from 'src/common/response/response.dto';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentIntent } from '../dto/api/create-payment-intent.api';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@ApiTags('Stripe')
@ApiExtraModels(CommonResponseDto)
@ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
@ApiInternalServerErrorResponse({ status: 500, description: 'Server Error' })
@ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
@UseGuards(RolesGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentsService: PaymentService,
    private configService: ConfigService,
  ) {}

  @Post('create-payment-intent/:orderId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'The end point for creating a payment intention' })
  @ApiCommonResponse(CreatePaymentIntent)
  async createPaymentIntent(
    @Param('orderId') orderId: number,
  ): Promise<CommonResponseDto<{ secret_key: string }>> {
    const result = await this.paymentsService.createPaymentIntent(orderId);
    return CommonResponse.succsessfully({ data: result });
  }

  @Post('webhook')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'The endpoint receives messages from the strip' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const stripeEvent = this.paymentsService.stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      this.configService.get<string>('stripe.whsec'),
    );
    await this.paymentsService.handleWebhook(stripeEvent);

    return;
  }
}
