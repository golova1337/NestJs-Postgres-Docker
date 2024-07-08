import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthAnswerDto {
  @ApiProperty({
    required: false,
    example:
      'eyJhbGciKiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjA0MzAwNDAsImV4cCI6MTcyMDQzMDk0MH0.ti42B3xDiPGBrGiR5UXsvd9DI407E22KyWwDRB1zR2QS',
  })
  accessToken: string;
  @ApiProperty({
    required: false,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey:pZCI6MSwi8m9sZSI6InVzZXIiLCJpYXQJOjE3MjA0MzAwNDAsImV4cCI6MTcyMTAzNDg0MH0.vZIAnb6Dz3wIBC5zZHLgySU9LU7xiy_BmAFj_jSa3yM',
  })
  refreshToken: string;
}
