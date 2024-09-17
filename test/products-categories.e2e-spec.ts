import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { redisStore } from 'cache-manager-redis-yet';
import { Sequelize } from 'sequelize-typescript';
import { Entities } from 'src/app.module';
import { AccessTokenGuard } from 'src/common/guards/jwt/accessToken.guard';
import * as request from 'supertest';
import { MockAuthGuard } from './guard/mock-auth.guard';
import { Category } from '../src/product/entities/category.entity';
import { ProductModule } from '../src/product/product.module';
import { CreateCategoryDto } from '../src/product/dto/category/create/create-category.dto';
import { Product } from '../src/product/entities/product.entity';

describe('product', () => {
  let sequelize: Sequelize;
  let app: INestApplication;
  let createdCategory: Category;
  let createdProduct: Product;

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
        BullModule.registerQueue({
          name: 'elastic',
          defaultJobOptions: { removeOnComplete: true },
          streams: { events: { maxLen: 5000 } },
        }),

        ProductModule,
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
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    sequelize = moduleFixture.get<Sequelize>(Sequelize);
  });

  it('Post categories', async () => {
    const category: CreateCategoryDto = {
      name: 't-shirt',
      desc: 'cotton',
    };
    const result = await request(app.getHttpServer())
      .post('/products/categories')
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
      .post('/products/categories')
      .send(category)
      .expect(500);
  });

  it('recieve all categories', async () => {
    const result = await request(app.getHttpServer())
      .get('/products/categories')
      .expect(200);
    expect(Array.isArray(result.body.data)).toBe(true);
  });

  it('category by id', async () => {
    const result = await request(app.getHttpServer())
      .get(`/products/categories/${createdCategory.id}`)
      .expect(200);
    expect(result.body.data.name).toBe('t-shirt');
  });

  it('update category by id', async () => {
    const newData = { desc: 'lux' };
    const result = await request(app.getHttpServer())
      .put(`/products/categories/${createdCategory.id}`)
      .send(newData)
      .expect(204);
    const category = await sequelize.models.Category.findByPk(
      createdCategory.id,
    );
    expect(category.dataValues.desc).toBe(newData.desc);
    createdCategory = category.dataValues;
  });

  it('product creation', async () => {
    const product = {
      name: 'carhartt',
      desc: 'jeans',
      SKU: 'CH120SL',
      price: 120.2,
      category_id: createdCategory.id,
      quantity: 120,
    };

    const result = await request(app.getHttpServer())
      .post('/products')
      .send(product)
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
      .send(newData)
      .expect(204);
    const product = await sequelize.models.Product.findByPk(createdProduct.id);
    createdProduct = product.dataValues;
    expect(createdProduct.name).toBe(newData.name);
  });

  it('Remove product by id', async () => {
    const ids = { ids: [createdProduct.id] };
    const result = await request(app.getHttpServer())
      .delete('/products')
      .send(ids)
      .expect(204);
    expect(result.body).toEqual({});
  });

  it('/Delete category by id', async () => {
    const result = await request(app.getHttpServer())
      .delete(`/products/categories/${createdCategory.id}`)
      .expect(204);
    expect(result.body).toEqual({});
  });

  afterAll(async () => {
    await sequelize.query(
      `DELETE FROM "store"."products" WHERE id=${createdProduct.id}`,
    );
    await sequelize.query(
      `DELETE FROM "store"."categories" WHERE id=${createdCategory.id}`,
    );
    app.close();
  });
});
