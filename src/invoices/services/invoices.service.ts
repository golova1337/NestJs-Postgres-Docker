import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { InvoiceGenerator } from './invoice-generator.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly invoiceGenerator: InvoiceGenerator,
  ) {}
  async generateInvoice(orderId: number) {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const invoiceData = {
      orderId: order.id,
      customer: {
        email: order.user.email,
      },
      items: order.orderItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.unit_price,
      })),
      total: order.total_amount,
      date: order.createdAt,
    };

    const invoicePath = `src/invoices/pdf_invoices/invoice_${order.id}.pdf`;

    await this.invoiceGenerator.createInvoice(invoiceData, invoicePath);
    return invoicePath;
  }
}
