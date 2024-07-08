import { ApiProperty } from '@nestjs/swagger';

export type Result<T> = {
  data?: T;
  meta?: object;
};

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

export class Response {
  static succsessfully<T>(result: Result<T>): CommonResponseDto<T> {
    return {
      status: true,
      error: false,
      message: 'Success',
      meta: result.meta || {},
      data: result.data,
    };
  }
}
