import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

@Injectable()
export class OtpService {
  async generateOtp(): Promise<string> {
    const bytes = randomBytes(3 * 2);
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
