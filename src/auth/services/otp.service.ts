import { OtpRepository } from '../repository/Otp.repository';
import { AuthRepository } from '../repository/Auth.repository';
import { Otp } from '../entities/Otp.entity';
import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  async findOtp(code: string): Promise<Otp> {
    const verificationCodes: Otp = await this.otpRepository.findOne(code);
    return verificationCodes;
  }

  async generateCode(): Promise<string> {
    const bytes = await randomBytes(3 * 2);
    return bytes
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 6);
  }
  async validateOtp(verificationCode: string, code: string): Promise<boolean> {
    return verificationCode === code;
  }

  async isOtpExpired(expiredAt: Date): Promise<boolean> {
    return expiredAt < new Date();
  }
}
