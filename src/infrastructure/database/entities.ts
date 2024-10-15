import { Jwt } from 'src/auth/entities/jwt.entity';
import { Otp } from 'src/auth/entities/otp.entity';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Discount } from 'src/discount/entities/discount.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { Payment } from 'src/infrastructure/payment/entities/payment.entity';
import { File } from 'src/product/entities/file.entity';
import { Inventory } from 'src/product/entities/inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Address } from 'src/user/entities/address.entity';

export const Entities = [
  User,
  Address,
  Otp,
  Product,
  Inventory,
  Discount,
  Category,
  Jwt,
  File,
  Order,
  OrderItem,
  Payment,
  Review,
];
