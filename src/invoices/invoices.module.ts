import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from 'src/order/entities/order.entity';
import { OrderRepository } from 'src/order/repositories/order.repository';
import { InvoicesController } from './controllers/invoices.controller';
import { InvoiceGenerator } from './services/invoice-generator.service';
import { InvoicesService } from './services/invoices.service';

export const Controllers = [InvoicesController];
export const Services = [InvoicesService, InvoiceGenerator];
export const Repository = [OrderRepository];
@Module({
  imports: [SequelizeModule.forFeature([Order])],
  controllers: [...Controllers],
  providers: [...Services, ...Repository],
})
export class InvoicesModule {}
