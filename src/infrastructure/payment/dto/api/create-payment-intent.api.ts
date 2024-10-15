import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntent {
  @ApiProperty({
    type: String,
    example: 'i_3PlXHp2M6RGPwxlZ271hxsUw_secret_ducnbeVnhdnfCkEOlhdoUAAO',
  })
  secret_key: string;
}
