import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { InsertJwtCommandHandler } from './commands/login/handlers/create-jwt.command.handler';
import { LogoutCommandHandler } from './commands/logout/handlers/logout.command.handler';
import { CreateOtpCommandHandler } from './commands/singIn/handlers/create-otp.command.handler';
import { CreateUserCommandHandler } from './commands/singIn/handlers/create-user.command.handler';
import { MakeUserVerifiedCommandHandler } from './commands/verify-otp/handlers/make-user-verified.command.handler';
import { EmailConsumer } from './consumers/email.consumer';
import { PhoneConsumer } from './consumers/phone.consumer';
import { AuthController } from './controllers/auth.controller';
import { LoginByEmailConstraint } from './decorators/constraint/login/loginByEmail';
import { LoginByPhoneConstraint } from './decorators/constraint/login/loginByPhone';
import { IsPasswordsMatchingConstraint } from './decorators/constraint/singIn/isPasswordsMatching';
import { SingInByEmailConstraint } from './decorators/constraint/singIn/signInByEmail';
import { SingInByPhoneConstraint } from './decorators/constraint/singIn/singInByPhone';
import { RepeatSendOtpByEmailConstraint } from './decorators/constraint/verify/repeatCode-email';
import { RepeatSendOtpByPhoneConstraint } from './decorators/constraint/verify/repeatCode-phone';
import { Jwt } from './entities/jwt.entity';
import { Otp } from './entities/otp.entity';
import { User } from './entities/user.entity';
import { LoginQueryHandlear } from './queries/login/handlers/login-check-user.query.handler';
import { RefreshQueryHandler } from './queries/refresh/handlers/refresh.query.handler';
import { CheckOtpQueryHandler } from './queries/verify-otp/handlers/check-otp.command.handler';
import { AuthRepository } from './repositories/auth.repository';
import { JwtRepository } from './repositories/jwt.repository';
import { OtpRepository } from './repositories/otp.repository';
import { AuthService } from './services/auth.service';
import { JwtTokenService } from './services/jwt.service';
import { OtpService } from './services/otp.service';
import { SendCodeService } from './services/sendCode.service';

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
  MakeUserVerifiedCommandHandler,
];

export const Services = [
  OtpService,
  JwtTokenService,
  SendCodeService,
  AuthService,
];

export const Entities = [User, Otp, Jwt];
export const Transaction = [SequelizeTransactionRunner];

@Module({
  imports: [
    SequelizeModule.forFeature([...Entities]),
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
    ...Transaction,
  ],
})
export class AuthModule {}
