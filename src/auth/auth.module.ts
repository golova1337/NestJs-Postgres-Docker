import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AuthRepository } from './repository/auth-repository';
import { SingInByEmailConstraint } from './decorators/class-validator/singIn/signInByEmail';
import { LoginByEmailConstraint } from './decorators/class-validator/login/loginByEmail';
import { IsPasswordsMatchingConstraint } from './decorators/class-validator/singIn/isPasswordsMatching';
import { JwtTokenService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRepository } from './repository/jwt-repository';
import { SingInByPhoneConstraint } from './decorators/class-validator/singIn/singInByPhone';
import { EmailConsumer } from '../common/consumers/email.consumer';
import { BullModule } from '@nestjs/bull';
import { PhoneConsumer } from '../common/consumers/phone.consumer';
import { VerificationCode } from './entities/verify.entity';
import { VerifyService } from './services/verify.service';
import { VerificationRepository } from './repository/verification-repository';
import { LoginByPhoneConstraint } from './decorators/class-validator/login/loginByPhone';
import { Jwt } from './entities/jwt.entity';
import { SendCodeService } from './services/sendCode.service';
import { RepeatSendCodeByPhoneConstraint } from './decorators/class-validator/verify/repeatCode-phone';
import { RepeatSendCodeByEmailConstraint } from './decorators/class-validator/verify/repeatCode-email';

@Module({
  imports: [
    SequelizeModule.forFeature([User, VerificationCode, Jwt]),
    JwtModule.register({}),
    BullModule.registerQueue({
      name: 'phone-sms',
    }),
    BullModule.registerQueue({
      name: 'email-sms',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,

    VerifyService,
    VerificationRepository,

    JwtTokenService,
    JwtRepository,

    SendCodeService,

    SingInByEmailConstraint,
    SingInByPhoneConstraint,

    LoginByEmailConstraint,
    LoginByPhoneConstraint,

    IsPasswordsMatchingConstraint,

    RepeatSendCodeByPhoneConstraint,
    RepeatSendCodeByEmailConstraint,

    EmailConsumer,
    PhoneConsumer,
  ],
})
export class AuthModule {}
