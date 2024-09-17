import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { Entities } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { SingInAuthUserDto } from 'src/auth/dto/create/create-auth.dto';
import { User } from 'src/auth/entities/user.entity';
import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';
import { SendCodeService } from 'src/auth/services/sendCode.service';
import { AccessTokenGuard } from 'src/common/guards/jwt/accessToken.guard';
import { AccessTokenStrategy } from 'src/common/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/common/strategies/refreshToken.strategy';
import * as request from 'supertest';

describe('Auth', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let createdUser: User;
  let sendCodeService: SendCodeService;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        MailerModule.forRoot({
          transport: {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          },
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
        AuthModule,
      ],
      providers: [
        RefreshTokenStrategy,
        AccessTokenStrategy,
        {
          provide: APP_GUARD,
          useClass: AccessTokenGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    sequelize = moduleFixture.get<Sequelize>(Sequelize);
    sendCodeService = moduleFixture.get<SendCodeService>(SendCodeService);

    await app.init();
  });

  it('/POST auth', async () => {
    const user: SingInAuthUserDto = {
      email: 'da22asasds2a@gmail.com',
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
      email: 'da22asasds2a@gmail.com',
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

  it('/PATCH refresh', async () => {
    const response = await request(app.getHttpServer())
      .patch('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)
      .send()
      .expect(200);

    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
  });

  it('/Patch logout', async () => {
    return request(app.getHttpServer())
      .patch('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(204);
  });

  afterAll(async () => {
    await sequelize.query(`DELETE FROM store.users WHERE id=${createdUser.id}`);

    await sequelize.close();
    await app.close();
  });
});
