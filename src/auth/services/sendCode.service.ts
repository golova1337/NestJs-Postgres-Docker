import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { Twilio } from 'twilio';

@Injectable()
export class SendCodeService {
  private readonly logger = new EmojiLogger();
  private twilioClient: Twilio;
  constructor(
    @InjectQueue('phone-sms') private phoneSmsQueue: Queue,
    @InjectQueue('email-sms') private emailSmsQueue: Queue,
  ) {}
  async send(messageParams: any) {
    const { registrationMethod, email, phone, otp } = messageParams;

    switch (registrationMethod) {
      case 'email':
        await this.emailSmsQueue.add(
          'email',
          {
            email: email,
            otp: otp,
          },
          { delay: 3000, priority: 1 },
        );
        break;
      case 'phone':
        await this.phoneSmsQueue.add(
          'phone',
          {
            phone: phone,
            otp: otp,
          },
          { delay: 3000, priority: 1 },
        );
        break;
      default:
        this.logger.warn('Send a message something is wrong');
        break;
    }
  }
}
