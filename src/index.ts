import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { UserModule } from './user/user.module';

export const BusenessLogic = [
  AuthModule,
  UserModule,
  ProductModule,
  ShoppingCartModule,
  DiscountModule,
  OrderModule,
  ReviewsModule,
  InvoicesModule,
  CategoryModule,
];
