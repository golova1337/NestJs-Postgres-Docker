import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class InvoiceGenerator {
  async createInvoice(invoiceData, invoicePath) {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(invoicePath);

    return new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);

      doc.pipe(stream);
      doc.fontSize(20).text('Invoice', { align: 'center' });
      doc.fontSize(14).text(`Order id: ${invoiceData.orderId}`);
      doc.text(`Date: ${invoiceData.date}`);
      doc.moveDown();
      invoiceData.items.forEach((item) => {
        doc.text(`${item.name} - ${item.quantity} x ${item.price} USD.`);
      });
      doc.moveDown();
      doc
        .fontSize(16)
        .text(`Total: ${invoiceData.total} USD.`, { align: 'right' });

      doc.end();
    });
  }
}
