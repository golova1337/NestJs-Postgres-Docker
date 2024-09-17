import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrderCommand } from '../update-order.impl';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from 'src/order/enum/order-status.enum';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderCommandHandler
  implements ICommandHandler<UpdateOrderCommand>
{
  constructor(private readonly orderRepository: OrderRepository) {}
  async execute(command: UpdateOrderCommand): Promise<any> {
    const { id, updateStatusOrderDto } = command;
    const { status } = updateStatusOrderDto;

    const order = await this.orderRepository.findOne(id);

    if (!order) throw new NotFoundException('Not Found');
    if (this.isStatusTransitionAllowed(order.status, status)) {
      console.log(order);
      order.status = status;
      return order.save();
    } else {
      throw new Error('Invalid status transition');
    }
  }
  private isStatusTransitionAllowed(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): boolean {
    const validTransitions = {
      [OrderStatus.Created]: [OrderStatus.Placed, OrderStatus.Cancelled],
      [OrderStatus.Placed]: [OrderStatus.Shipped, OrderStatus.Cancelled],
      [OrderStatus.Shipped]: [OrderStatus.Delivery, OrderStatus.Returned],
      [OrderStatus.Delivery]: [OrderStatus.Returned],
      [OrderStatus.Cancelled]: [],
      [OrderStatus.Returned]: [],
    };

    return validTransitions[currentStatus].includes(newStatus);
  }
}
