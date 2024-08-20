import { UpdateStatusOrderDto } from 'src/order/dto/update-order.dto';

export class UpdateOrderCommand {
  constructor(
    public readonly id: number,
    public readonly updateStatusOrderDto: UpdateStatusOrderDto,
  ) {}
}
