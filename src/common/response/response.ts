import { ApiProperty } from '@nestjs/swagger';

export type Result<T> = {
  data?: T;
  meta?: object;
};

export class CommonResponse<T> {
  @ApiProperty({
    description: 'Status of request fulfillment',
    required: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Flag indicating the presence of an error',
    required: true,
    example: false,
  })
  error: boolean;

  @ApiProperty({
    description: 'Reporting success or errors',
    required: true,
    example: 'Success',
  })
  message: string;

  @ApiProperty({ description: 'Additional metadata', required: true })
  meta: object;

  @ApiProperty({
    description: 'Response data (optional)',
    required: true,
  })
  data?: T;
}

export class Response {
  static succsessfully<T>(result: Result<T>): CommonResponse<T> {
    return {
      status: true,
      error: false,
      message: 'Success',
      meta: result.meta || {},
      data: result.data,
    };
  }
}
