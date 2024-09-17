import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EmojiLogger } from '../../common/logger/emojiLogger';

@Injectable()
export class SendCodeService {
  private readonly logger = new EmojiLogger();

  constructor(@InjectQueue('sent-sms') private sentSmsQueue: Queue) {}

  async send(messageParams: any) {
    const { registrationMethod, email, phone, otp } = messageParams;

    switch (registrationMethod) {
      case 'email':
        await this.sentSmsQueue.add(
          'email-sms',
          {
            email: email,
            otp: otp,
          },
          { delay: 3000, priority: 1, removeOnComplete: true },
        );
        break;
      case 'phone':
        await this.sentSmsQueue.add(
          'phone-sms',
          {
            phone: phone,
            otp: otp,
          },
          { delay: 3000, priority: 1, removeOnComplete: true },
        );
        break;
      default:
        this.logger.warn('Send a message something is wrong');
        break;
    }
  }
}
