import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailConsumer } from '../common/consumers/email.consumer';
import { PhoneConsumer } from '../common/consumers/phone.consumer';
import { InsertJwtCommandHandler } from './commands/login/handlers/Create-jwt.command.handler';
import { LogoutCommandHandler } from './commands/logout/handlers/Logout.command.handler';
import { CreateOtpCommandHandler } from './commands/singIn/handlers/Create-otp.command.handler';
import { CreateUserCommandHandler } from './commands/singIn/handlers/Create-user.command.handler';
import { RemoveOtpCommandHandler } from './commands/verify-otp/handlers/Remove-otp.command.handler';
import { VerifyUserCommandHandler } from './commands/verify-otp/handlers/Verify-user.command.handler';
import { AuthController } from './controllers/auth.controller';
import { LoginByEmailConstraint } from './decorators/class-validator/login/loginByEmail';
import { LoginByPhoneConstraint } from './decorators/class-validator/login/loginByPhone';
import { IsPasswordsMatchingConstraint } from './decorators/class-validator/singIn/isPasswordsMatching';
import { SingInByEmailConstraint } from './decorators/class-validator/singIn/signInByEmail';
import { SingInByPhoneConstraint } from './decorators/class-validator/singIn/singInByPhone';
import { RepeatSendOtpByEmailConstraint } from './decorators/class-validator/verify/repeatCode-email';
import { RepeatSendOtpByPhoneConstraint } from './decorators/class-validator/verify/repeatCode-phone';
import { Jwt } from './entities/Jwt.entity';
import { Otp } from './entities/Otp.entity';
import { User } from './entities/User.entity';
import { LoginQueryHandlear } from './queries/login/handlers/Login-check-user.query.handler';
import { RefreshQueryHandler } from './queries/refresh/handlers/Refresh.query.handler';
import { CheckOtpQueryHandler } from './queries/verify-otp/handlers/Check-otp.command.handler';
import { AuthRepository } from './repository/Auth.repository';
import { JwtRepository } from './repository/Jwt.repository';
import { OtpRepository } from './repository/Otp.repository';
import { AuthService } from './services/Auth.service';
import { JwtTokenService } from './services/Jwt.service';
import { OtpService } from './services/Otp.service';
import { SendCodeService } from './services/SendCode.service';

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
export const QueryHandler = [
  LoginQueryHandlear,
  InsertJwtCommandHandler,
  CheckOtpQueryHandler,
  RefreshQueryHandler,
];
export const CommandHandler = [
  CreateUserCommandHandler,
  CreateOtpCommandHandler,
  LogoutCommandHandler,
  VerifyUserCommandHandler,
  RemoveOtpCommandHandler,
];
export const Services = [
  OtpService,
  JwtTokenService,
  SendCodeService,
  AuthService,
];

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
    ...QueryHandler,
    ...CommandHandler,
    ...Services,
  ],
})
export class AuthModule {}
