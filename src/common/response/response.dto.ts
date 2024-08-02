import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto<T> {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  error: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  meta: object;

  @ApiProperty()
  data: T;
}

export class CommonResponse {
  static succsessfully<T>(result): CommonResponseDto<T> {
    return {
      status: true,
      error: false,
      message: 'Success',
      meta: result.meta || {},
      data: result.data,
    };
  }
}
