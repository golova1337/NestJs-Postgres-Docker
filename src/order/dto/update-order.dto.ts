import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enum/order-status.enum';
import { IsDefined } from 'class-validator';

export class UpdateStatusOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsDefined()
  status: OrderStatus;
}
