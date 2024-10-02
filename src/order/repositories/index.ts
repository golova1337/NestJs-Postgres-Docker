import { ProductRepository } from 'src/product/repositories/product.repository';
import { OrderItemRepository } from './order-item.repository';
import { OrderRepository } from './order.repository';

export const Repositories = [
  ProductRepository,
  OrderItemRepository,
  OrderRepository,
];
