import { AuthRepository } from './auth.repository';
import { JwtRepository } from './jwt.repository';
import { OtpRepository } from './otp.repository';

export const Repository = [AuthRepository, OtpRepository, JwtRepository];
