import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvoicesService } from '../services/invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':orderId')
  async getInvoice(@Param('orderId') orderId: number, @Res() res: Response) {
    const invoicePath = await this.invoicesService.generateInvoice(orderId);
    res.sendFile(invoicePath, { root: '.' });
  }
}
