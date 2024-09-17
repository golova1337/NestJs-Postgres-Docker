import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from 'src/app.module';
import { SingInAuthUserDto } from 'src/auth/dto/create/create-auth.dto';
import { User } from 'src/auth/entities/user.entity';
import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';
import { SendCodeService } from 'src/auth/services/sendCode.service';
import { Order } from 'src/order/entities/order.entity';
import { OrderStatus } from 'src/order/enum/order-status.enum';
import { CreateCategoryDto } from 'src/product/dto/category/create/create-category.dto';
import { Category } from 'src/product/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import * as request from 'supertest';

describe('product', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let sendCodeService: SendCodeService;
  let createdUser: User;
  let createdCategory: Category;
  let createdProduct: Product;
  let createdOrder: Order;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    sequelize = moduleFixture.get<Sequelize>(Sequelize);
    sendCodeService = moduleFixture.get<SendCodeService>(SendCodeService);
    await app.init();
  });

  it('/POST auth', async () => {
    const user: SingInAuthUserDto = {
      email: 'johncroup@gmail.com',
      password: 'Example123456!',
      passwordRepeat: 'Example123456!',
      registrationMethod: RegistrationMethod.EMAIL,
    };

    jest.spyOn(sendCodeService, 'send').mockImplementation(async () => {});
    const response = await request(app.getHttpServer())
      .post('/auth/sing-in/admin')
      .send(user)
      .expect(201);

    createdUser = response.body.data;
    expect(createdUser.email).toBe(user.email);
  });

  it('/PATCH verify', async () => {
    const otp = await sequelize.models.Otp.findOne({
      where: { userId: createdUser.id },
    });

    const response = await request(app.getHttpServer())
      .patch('/auth/verify')
      .query({ otp: otp.dataValues.otp });

    expect(response.status).toBe(204);
  });

  it('/POST login', async () => {
    const user = {
      email: 'johncroup@gmail.com',
      password: 'Example123456!',
      registrationMethod: 'email',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(200);

    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
    accessToken = response.body.data.accessToken;
  });

  it('Post categories', async () => {
    const category: CreateCategoryDto = {
      name: 'shirt',
      desc: 'cotton',
    };
    const result = await request(app.getHttpServer())
      .post('/products/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(category)
      .expect(201);

    expect(result.body.data.name).toBe(category.name);
    createdCategory = result.body.data;
  });

  it('product creation', async () => {
    const product = {
      name: 'puma',
      desc: 'sneakers',
      SKU: 'PS130SM',
      price: 120.2,
      category_id: createdCategory.id,
      quantity: 120,
    };

    const result = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(product)
      .expect(201);

    expect(result.body.data.product.name).toBe(product.name);
    createdProduct = result.body.data.product;
  });

  it('add item', async () => {
    const dataItem = {
      productId: createdProduct.id,
      quantity: 10,
    };
    return request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dataItem)
      .expect(204);
  });

  it('create order', async () => {
    const result = await request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
    expect(result.body.data).toHaveProperty('orderItems');
    createdOrder = result.body.data.order;
  });

  it('Recieve all orders', async () => {
    const result = await request(app.getHttpServer())
      .get('/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(result.body.data)).toBe(true);
  });

  it('Recieve one order', async () => {
    const result = await request(app.getHttpServer())
      .get(`/order/${createdOrder.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(result.body.data.id).toBe(createdOrder.id);
  });

  it('update order status', async () => {
    return request(app.getHttpServer())
      .patch(`/order/${createdOrder.id}`)
      .send({ status: OrderStatus.Placed })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  it('delete order', async () => {
    return request(app.getHttpServer())
      .delete(`/order/${createdOrder.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  afterAll(async () => {
    await sequelize.query(`DELETE FROM store.users WHERE id=${createdUser.id}`);
    await sequelize.query(
      `DELETE FROM "store"."products" WHERE id=${createdProduct.id}`,
    );
    await sequelize.query(
      `DELETE FROM "store"."categories" WHERE id=${createdCategory.id}`,
    );
    await app.close();
  });
});
