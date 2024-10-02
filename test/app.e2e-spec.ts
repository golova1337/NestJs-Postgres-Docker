import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from 'src/app.module';
import { SingInAuthUserDto } from 'src/auth/dto/create/create-auth.dto';
import { User } from 'src/auth/entities/user.entity';
import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';
import { SendCodeService } from 'src/auth/services/sendCode.service';
import { CreateCategoryDto } from 'src/category/dto/category/create/create-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { AccessTokenGuard } from 'src/common/guards/jwt/accessToken.guard';
import { Product } from 'src/product/entities/product.entity';
import * as request from 'supertest';
import { MockAuthGuard } from './guard/mock-auth.guard';
import { Discount } from 'src/discount/entities/discount.entity';
import { Sign } from 'src/product/enum/sign-enum';

describe('APP', () => {
  let sequelize: Sequelize;
  let app: INestApplication;
  let createdUser: User;
  let sendCodeService: SendCodeService;
  let accessToken: string;
  let refreshToken: string;
  let createdCategory: Category;
  let createdProduct: Product;
  let createdDisount: Discount;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AccessTokenGuard)
      .useClass(MockAuthGuard)
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    sequelize = moduleFixture.get<Sequelize>(Sequelize);
    sendCodeService = moduleFixture.get<SendCodeService>(SendCodeService);
  });

  describe('auth', () => {
    it('sing-in', async () => {
      const user: SingInAuthUserDto = {
        email: 'sda2v2asa3ds2a@gmail.com',
        password: 'Example123456!',
        passwordRepeat: 'Example123456!',
        registrationMethod: RegistrationMethod.EMAIL,
      };

      jest.spyOn(sendCodeService, 'send').mockImplementation(async () => {});
      const response = await request(app.getHttpServer())
        .post('/auth/sing-in')
        .send(user)
        .expect(201);

      createdUser = response.body.data;
      expect(sendCodeService.send).toHaveBeenCalled();
      expect(createdUser.email).toBe(user.email);
    });

    it('verify', async () => {
      const otp = await sequelize.models.Otp.findOne({
        where: { userId: createdUser.id },
      });

      const response = await request(app.getHttpServer())
        .patch('/auth/verify')
        .query({ otp: otp.dataValues.otp });

      expect(response.status).toBe(204);
    });

    it('login', async () => {
      const user = {
        email: 'sda2v2asa3ds2a@gmail.com',
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
      refreshToken = response.body.data.refreshToken;
    });

    it('refresh', async () => {
      const response = await request(app.getHttpServer())
        .patch('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .send()
        .expect(200);

      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('logout', async () => {
      return request(app.getHttpServer())
        .patch('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(204);
    });
  });

  describe('discount', () => {
    it('Creation', async () => {
      const discount = {
        name: 'summer',
        desc: 'the hot sale 2024',
        discount_percent: '20.20',
      };
      const result = await request(app.getHttpServer())
        .post('/discounts')
        .send(discount)
        .expect(201);
      expect(result.body.data.name).toBe(discount.name);
      createdDisount = result.body.data;
    });

    it('recieve', async () => {
      const result = await request(app.getHttpServer())
        .get('/discounts')
        .expect(200);
      expect(Array.isArray(result.body.data.discounts)).toBe(true);
    });

    it('recieve by id', async () => {
      const result = await request(app.getHttpServer())
        .get(`/discounts/${createdDisount.id}`)
        .expect(200);
      expect(result.body.data.name).toBe('summer');
    });

    it('update by id', async () => {
      const newData = { desc: 'the hot sale 2025', discount_percent: '25.00' };
      const result = await request(app.getHttpServer())
        .patch(`/discounts/${createdDisount.id}`)
        .send(newData)
        .expect(204);

      const discount = await sequelize.models.Discount.findByPk(
        createdDisount.id,
      );
      expect(discount.dataValues.discount_percent).toBe('25.00');
    });

    it('remove by ids', async () => {
      const ids = { ids: [createdDisount.id] };
      const result = await request(app.getHttpServer())
        .delete('/discounts')
        .send(ids)
        .expect(204);

      expect(result.body.data).toBeUndefined();
    });
  });

  describe('categories', () => {
    it('Post categories', async () => {
      const category: CreateCategoryDto = {
        name: 't-shirt',
        desc: 'cotton',
      };
      const result = await request(app.getHttpServer())
        .post('/categories')
        .send(category)
        .expect(201);

      expect(result.body.data.name).toBe(category.name);
      createdCategory = result.body.data;
    });

    it('Reapet creation categories duplicate name ', async () => {
      const category: CreateCategoryDto = {
        name: 't-shirt',
        desc: 'cotton',
      };
      return request(app.getHttpServer())
        .post('/categories')
        .send(category)
        .expect(500);
    });

    it('recieve all categories', async () => {
      const result = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);
      expect(Array.isArray(result.body.data)).toBe(true);
    });

    it('category by id', async () => {
      const result = await request(app.getHttpServer())
        .get(`/categories/${createdCategory.id}`)
        .expect(200);
      expect(result.body.data.name).toBe('t-shirt');
    });

    it('update category by id', async () => {
      const newData = { desc: 'lux' };
      const result = await request(app.getHttpServer())
        .put(`/categories/${createdCategory.id}`)
        .send(newData)
        .expect(204);
      const category = await sequelize.models.Category.findByPk(
        createdCategory.id,
      );
      expect(category.dataValues.desc).toBe(newData.desc);
      createdCategory = category.dataValues;
    });
  });

  describe('products', () => {
    it('product creation', async () => {
      const product = {
        name: 'carhartt',
        desc: 'jeans',
        SKU: 'CH120SL',
        price: 130.2,
        category_id: createdCategory.id,
        quantity: 140,
      };
      const jsonString = JSON.stringify(product);
      const result = await request(app.getHttpServer())
        .post('/products')
        .attach('files', 'test/testUtils/pexels-pixabay-104827.jpg')
        .field({
          ['name']: product.name,
          ['desc']: product.desc,
          ['SKU']: product.SKU,
          ['price']: product.price,
          ['category_id']: product.category_id,
          ['quantity']: product.quantity,
        })
        .expect(201);

      expect(result.body.data.product.name).toBe(product.name);
      createdProduct = result.body.data.product;
    });

    it('find all products', async () => {
      const result = await request(app.getHttpServer())
        .get('/products')
        .expect(200);
      expect(Array.isArray(result.body.data.products)).toBe(true);
    });

    it('Get find one by id', async () => {
      const result = await request(app.getHttpServer())
        .get(`/products/${createdProduct.id}`)
        .expect(200);

      expect(result.body.data.name).toBe(createdProduct.name);
    });

    it('Update product by id', async () => {
      const newData = { name: 'stussy' };
      const result = await request(app.getHttpServer())
        .put(`/products/${createdProduct.id}`)
        .field({ ['name']: newData.name })
        .expect(204);
      const product = await sequelize.models.Product.findByPk(
        createdProduct.id,
      );
      createdProduct = product.dataValues;
      expect(createdProduct.name).toBe(newData.name);
    });
  });

  describe('shopping cart', () => {
    it('add item', async () => {
      const dataItem = {
        productId: createdProduct.id,
        quantity: 10,
      };
      return request(app.getHttpServer())
        .post('/cart/add')
        .send(dataItem)
        .expect(204);
    });

    it('summary cart', async () => {
      const result = await request(app.getHttpServer())
        .get('/cart/summary')
        .expect(200);
      expect(result.body.data).toHaveProperty('cart');
      expect(Array.isArray(result.body.data.cart)).toBe(true);
    });

    it('update cart Plus items', async () => {
      const dataUpdate = {
        productId: createdProduct.id,
        sign: Sign.Plus,
        quantity: 5,
      };
      const result = await request(app.getHttpServer())
        .patch('/cart/update')
        .send(dataUpdate)
        .expect(200);
      expect(result.body.data).toHaveProperty('cart');
      expect(Array.isArray(result.body.data.cart)).toBe(true);
    });

    it('update cart Minus items', async () => {
      const dataUpdate = {
        productId: createdProduct.id,
        sign: Sign.Minus,
        quantity: 5,
      };
      const result = await request(app.getHttpServer())
        .patch('/cart/update')
        .send(dataUpdate)
        .expect(200);
      expect(result.body.data).toHaveProperty('cart');
      expect(Array.isArray(result.body.data.cart)).toBe(true);
    });

    it('remove item by id', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/cart/items/${createdProduct.id}`)
        .expect(200);
      expect(result.body.data).toBeUndefined();
    });
  });

  describe('products & categories removing', () => {
    it('Remove product by id', async () => {
      const ids = { ids: [createdProduct.id] };
      const result = await request(app.getHttpServer())
        .delete('/products')
        .send(ids)
        .expect(204);
      expect(result.body).toEqual({});
    });
    it('Remove category by id', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/categories/${createdCategory.id}`)
        .expect(204);
      expect(result.body).toEqual({});
    });
  });

  afterAll(async () => {
    await sequelize.query('DELETE FROM "store"."discounts"');
    await sequelize.query(
      `DELETE FROM "store"."products" WHERE id=${createdProduct.id}`,
    );
    await sequelize.query(
      `DELETE FROM "store"."categories" WHERE id=${createdCategory.id}`,
    );
    await sequelize.query(`DELETE FROM store.users WHERE id=${createdUser.id}`);
    app.close();
  });
});
