import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { redisStore } from 'cache-manager-redis-yet';
import { Entities } from 'src/app.module';
import { AccessTokenGuard } from 'src/common/guards/jwt/accessToken.guard';
import { Sign } from 'src/product/enum/sign-enum';
import { ProductRepository } from 'src/product/repositories/product.repository';
import { ShoppingCartModule } from 'src/shopping_cart/shopping_cart.module';
import * as request from 'supertest';
import { MockAuthGuard } from './guard/mock-auth.guard';

describe('shopping cart', () => {
  let app: INestApplication;
  let productRepository = {
    findProductById: () => {
      return {
        id: '1',
        name: 'carhartt',
        desc: 'jeans',
        SKU: 'CH120SL',
        category_id: 7,
        inventory_id: 4,
        discount_id: null,
        price: '120.20',
        createdAt: '2024-09-13T10:46:16.538Z',
        updatedAt: '2024-09-13T10:46:16.538Z',
        deletedAt: null,
        files: [],
        inventory: {
          id: 4,
          quantity: 120,
          createdAt: '2024-09-13T10:46:16.534Z',
          updatedAt: '2024-09-13T10:46:16.534Z',
          deletedAt: null,
        },
        category: {
          id: 7,
          name: 't-shirt',
          desc: 'lux',
          createdAt: '2024-09-13T10:46:16.446Z',
          updatedAt: '2024-09-13T10:46:16.521Z',
          deletedAt: null,
        },
        discount: null,
        reviews: [],
        avgRating: null,
      };
    },
    findManyProductsByIds: () => {
      return [
        {
          id: '1',
          name: 'carhartt',
          desc: 'jeans',
          SKU: 'CH120SL',
          category_id: 7,
          inventory_id: 4,
          discount_id: null,
          price: '120.20',
          createdAt: '2024-09-13T10:46:16.538Z',
          updatedAt: '2024-09-13T10:46:16.538Z',
          deletedAt: null,
          files: [],
          inventory: {
            id: 4,
            quantity: 120,
            createdAt: '2024-09-13T10:46:16.534Z',
            updatedAt: '2024-09-13T10:46:16.534Z',
            deletedAt: null,
          },
          category: {
            id: 7,
            name: 't-shirt',
            desc: 'lux',
            createdAt: '2024-09-13T10:46:16.446Z',
            updatedAt: '2024-09-13T10:46:16.521Z',
            deletedAt: null,
          },
          discount: null,
          reviews: [],
          avgRating: null,
        },
      ];
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        BullModule.forRoot({
          connection: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
          },
        }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: 'localhost',
          port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          schema: 'store',
          models: [...Entities],
          pool: {
            max: 10,
            min: 3,
          },
          autoLoadModels: true,
          synchronize: true,
        }),
        CacheModule.register({
          isGlobal: true,
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        }),

        ShoppingCartModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useExisting: AccessTokenGuard,
        },
        AccessTokenGuard,
      ],
    })
      .overrideProvider(AccessTokenGuard)
      .useClass(MockAuthGuard)
      .overrideProvider(ProductRepository)
      .useValue(productRepository)
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('add item', async () => {
    const dataItem = {
      productId: 1,
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
    const dataUpdate = { productId: 1, sign: Sign.Plus, quantity: 5 };
    const result = await request(app.getHttpServer())
      .patch('/cart/update')
      .send(dataUpdate)
      .expect(200);
    expect(result.body.data).toHaveProperty('cart');
    expect(Array.isArray(result.body.data.cart)).toBe(true);
  });

  it('update cart Minus items', async () => {
    const dataUpdate = { productId: 1, sign: Sign.Minus, quantity: 5 };
    const result = await request(app.getHttpServer())
      .patch('/cart/update')
      .send(dataUpdate)
      .expect(200);
    expect(result.body.data).toHaveProperty('cart');
    expect(Array.isArray(result.body.data.cart)).toBe(true);
  });

  it('remove item by id', async () => {
    const result = await request(app.getHttpServer())
      .delete(`/cart/items/${1}`)
      .expect(200);
    expect(result.body.data).toBeUndefined();
  });

  it('add item', async () => {
    const dataItem = {
      productId: 1,
      quantity: 10,
    };
    return request(app.getHttpServer())
      .post('/cart/add')
      .send(dataItem)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
