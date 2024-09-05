import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/services/auth.service';

describe('Cats', () => {
  let app: INestApplication;
  let authService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/Post auth`, () => {
    return request(app.getHttpServer()).post('/auth').expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
