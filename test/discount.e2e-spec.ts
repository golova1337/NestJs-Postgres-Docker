import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { Entities } from 'src/app.module';
import { AccessTokenGuard } from 'src/common/guards/jwt/accessToken.guard';
import { DiscountModule } from 'src/discount/discount.module';
import * as request from 'supertest';
import { Discount } from 'src/discount/entities/discount.entity';
import { MockAuthGuard } from './guard/mock-auth.guard';

describe('product', () => {
  let sequelize: Sequelize;
  let app: INestApplication;
  let createdDisount: Discount;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
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

        DiscountModule,
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

  it('/Creation discount', async () => {
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

  it('/recieve all discounts', async () => {
    const result = await request(app.getHttpServer())
      .get('/discounts')
      .expect(200);
    expect(Array.isArray(result.body.data.discounts)).toBe(true);
  });

  it('/recieve by id', async () => {
    const result = await request(app.getHttpServer())
      .get(`/discounts/${createdDisount.id}`)
      .expect(200);
    expect(result.body.data.name).toBe('summer');
  });

  it('/update by id', async () => {
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

  it('/remove by ids', async () => {
    const ids = { ids: [createdDisount.id] };
    const result = await request(app.getHttpServer())
      .delete('/discounts')
      .send(ids)
      .expect(204);

    expect(result.body.data).toBeUndefined();
  });

  afterAll(async () => {
    await sequelize.query('DELETE FROM "store"."discounts"');
    app.close();
  });
});
