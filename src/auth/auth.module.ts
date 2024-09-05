import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtCreationCommandHandler } from './commands/login/handlers/jwt-creation.command.handler';
import { LogoutCommandHandler } from './commands/logout/handlers/logout.command.handler';
import { UserCreationCommandHandler } from './commands/singIn/handlers/user-creation.command.handler';
import { OtpCreationAndSavingCommandHandler } from './commands/singIn/handlers/otp-creation-and-saving.command.handler';
import { VerifyUserCommandHandler } from './commands/verify-user/handlers/verify-user.command.handler';
import { SentSmsConsumer } from './consumers/sent-sms.consumer';
import { AuthController } from './controllers/auth.controller';
import { LoginByEmailConstraint } from './decorators/constraint/login/loginByEmail';
import { LoginByPhoneConstraint } from './decorators/constraint/login/loginByPhone';
import { IsPasswordsMatchingConstraint } from './decorators/constraint/singIn/isPasswordsMatching';
import { SingInByEmailConstraint } from './decorators/constraint/singIn/signInByEmail';
import { SingInByPhoneConstraint } from './decorators/constraint/singIn/singInByPhone';
import { RepeatSendOtpByEmailConstraint } from './decorators/constraint/verify/repeat-code-email.constraint';
import { RepeatSendOtpByPhoneConstraint } from './decorators/constraint/verify/repeat-code-phone.constraint';
import { Jwt } from './entities/jwt.entity';
import { Otp } from './entities/otp.entity';
import { User } from './entities/user.entity';
import { LoginCheckingQueryHandler } from './queries/login/handlers/login-checking-user.query.handler';
import { ReceivingAndCheckingJwtQueryHandler } from './queries/refresh/handlers/receiving-and-checking-jwt.query.handler';
import { ReceivingAndCheckingOtpQueryHandler } from './queries/verify-otp/handlers/receiving-and-checking.query.handler';
import { AuthRepository } from './repositories/auth.repository';
import { JwtRepository } from './repositories/jwt.repository';
import { OtpRepository } from './repositories/otp.repository';
import { AuthService } from './services/auth.service';
import { JwtTokenService } from './services/jwt.service';
import { OtpService } from './services/otp.service';
import { SendCodeService } from './services/sendCode.service';
import { OtpUpdatingAndSavingCommandHandler } from './commands/update-otp/handlers/otp-updating-and-saving.command.handler';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';

export const Repository = [AuthRepository, OtpRepository, JwtRepository];

export const Consumer = [SentSmsConsumer];

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
  LoginCheckingQueryHandler,

  ReceivingAndCheckingOtpQueryHandler,
  ReceivingAndCheckingJwtQueryHandler,
];

export const CommandHandler = [
  UserCreationCommandHandler,
  JwtCreationCommandHandler,
  OtpCreationAndSavingCommandHandler,
  LogoutCommandHandler,
  VerifyUserCommandHandler,
  OtpUpdatingAndSavingCommandHandler,
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
      name: 'sent-sms',
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
