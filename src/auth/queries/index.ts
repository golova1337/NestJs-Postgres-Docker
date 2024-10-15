import { LoginCheckingQueryHandler } from './login/handlers/login-checking-user.query.handler';
import { ReceivingAndCheckingJwtQueryHandler } from './refresh/handlers/receiving-and-checking-jwt.query.handler';
import { ReceivingAndCheckingOtpQueryHandler } from './verify-otp/handlers/receiving-and-checking.query.handler';

export const QueryHandlers = [
  LoginCheckingQueryHandler,
  ReceivingAndCheckingOtpQueryHandler,
  ReceivingAndCheckingJwtQueryHandler,
];
