import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/User.entity';
import { AuthRepository } from './repository/Auth.repository';
import { SingInByEmailConstraint } from './decorators/class-validator/singIn/signInByEmail';
import { LoginByEmailConstraint } from './decorators/class-validator/login/loginByEmail';
import { IsPasswordsMatchingConstraint } from './decorators/class-validator/singIn/isPasswordsMatching';
import { JwtTokenService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRepository } from './repository/Jwt.repository';
import { SingInByPhoneConstraint } from './decorators/class-validator/singIn/singInByPhone';
import { EmailConsumer } from '../common/consumers/email.consumer';
import { BullModule } from '@nestjs/bull';
import { PhoneConsumer } from '../common/consumers/phone.consumer';
import { OtpService } from './services/otp.service';
import { LoginByPhoneConstraint } from './decorators/class-validator/login/loginByPhone';
import { Jwt } from './entities/Jwt.entity';
import { SendCodeService } from './services/sendCode.service';
import { RepeatSendOtpByPhoneConstraint } from './decorators/class-validator/verify/repeatCode-phone';
import { RepeatSendOtpByEmailConstraint } from './decorators/class-validator/verify/repeatCode-email';
import { CqrsModule } from '@nestjs/cqrs';
import { SingInCreateUserCommandHandler } from './commands/singIn/handlers/Sing-in-create-user.command.handler';
import { SingInCreateOtpCommandHandler } from './commands/singIn/handlers/Sing-in-create-otp.command.handler';
import { LoginQueryHandlear } from './queries/login/handlers/Login-check-user.query.handler';
import { LoginCreateJwtQueryHandler } from './queries/login/handlers/Login-create-jwt.query.handler';
import { LogoutCommandHandler } from './commands/logout/handlers/Logout.command.handler';
import { RefreshCommandHandler } from './commands/refresh/handlers/Refresh.command.handler';
import { IsVerifiedCommandHandler } from './commands/verify-otp/handlers/User-is-verified.command.handler';
import { CheckOtpCommandHandler } from './commands/verify-otp/handlers/Check-otp.command.handler';
import { RemoveOtpCommandHandler } from './commands/verify-otp/handlers/Remove-otp.command.handler';
import { OtpRepository } from './repository/Otp.repository';
import { Otp } from './entities/Otp.entity';
import { RepeatSendOtpCommandHandler } from './commands/repeat-otp/handlers/Repeat-otp.command.handler';

export const Repository = [AuthRepository, OtpRepository, JwtRepository];
export const Consumer = [EmailConsumer, PhoneConsumer];
export const Constraint = [
  SingInByEmailConstraint,
  SingInByPhoneConstraint,

  LoginByEmailConstraint,
  LoginByPhoneConstraint,

  IsPasswordsMatchingConstraint,

  RepeatSendOtpByPhoneConstraint,
  RepeatSendOtpByEmailConstraint,
];
export const Handler = [
  SingInCreateUserCommandHandler,
  SingInCreateOtpCommandHandler,
  LoginQueryHandlear,
  LoginCreateJwtQueryHandler,
  LogoutCommandHandler,
  RefreshCommandHandler,
  CheckOtpCommandHandler,
  IsVerifiedCommandHandler,
  RemoveOtpCommandHandler,
  RepeatSendOtpCommandHandler,
];
export const Service = [OtpService, JwtTokenService, SendCodeService];

@Module({
  imports: [
    SequelizeModule.forFeature([User, Otp, Jwt]),
    JwtModule.register({}),
    BullModule.registerQueue({
      name: 'phone-sms',
    }),
    BullModule.registerQueue({
      name: 'email-sms',
    }),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    ...Repository,
    ...Constraint,
    ...Consumer,
    ...Handler,
    ...Service,
  ],
})
export class AuthModule {}
