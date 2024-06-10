import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AuthRepository } from './repository/user-repository';
import { SingInByEmailConstraint } from './decorators/class-validator/signInByEmail';
import { LoginByEmailConstraint } from './decorators/class-validator/loginByEmail';
import { IsPasswordsMatchingConstraint } from './decorators/class-validator/isPasswordsMatching';
import { JwtTokenService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRepository } from './repository/jwt-repository';
import { SingInByPhoneConstraint } from './decorators/class-validator/singInByPhone';
import { EmailConsumer } from './consumers/email.consumer';
import { BullModule } from '@nestjs/bull';
import { PhoneConsumer } from './consumers/phone.consumer';
import { VerificationCodes } from './entities/verify.entity';
import { VerifyService } from './services/verify.service';
import { VerifyController } from './controllers/verify.controller';
import { VerificationRepository } from './repository/verification-repository';
import { LoginByPhoneConstraint } from './decorators/class-validator/loginByPhone';

@Module({
  imports: [
    SequelizeModule.forFeature([User, VerificationCodes]),
    JwtModule.register({}),
    BullModule.registerQueue({
      name: 'phone-sms',
    }),
    BullModule.registerQueue({
      name: 'email-sms',
    }),
  ],
  controllers: [AuthController, VerifyController],
  providers: [
    AuthService,
    AuthRepository,

    VerifyService,
    VerificationRepository,

    JwtTokenService,
    JwtRepository,

    SingInByEmailConstraint,
    SingInByPhoneConstraint,
    LoginByEmailConstraint,
    LoginByPhoneConstraint,
    IsPasswordsMatchingConstraint,

    EmailConsumer,
    PhoneConsumer,
  ],
})
export class AuthModule {}
