import { DiscountRepository } from 'src/discount/repositories/discount.repository';
import { FileRepository } from './file.repository';
import { InventoryRepository } from './inventory.repository';
import { ProductRepository } from './product.repository';
import { ReviewRepository } from 'src/reviews/repositories/review.repository';

export const Repository = [
  ProductRepository,
  FileRepository,
  InventoryRepository,
  DiscountRepository,
  ReviewRepository,
];
