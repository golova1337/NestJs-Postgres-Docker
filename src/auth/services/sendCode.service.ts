import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class SendCodeService {
  constructor(
    @InjectQueue('phone-sms') private phoneSmsQueue: Queue,
    @InjectQueue('email-sms') private emailSmsQueue: Queue,
  ) {}
  async send(messageParams: any) {
    const { registrationMethod, email, numbers, code } = messageParams;

    switch (registrationMethod) {
      case 'email':
        await this.emailSmsQueue.add(
          'email',
          {
            email: email,
            code: code,
          },
          { delay: 3000, priority: 1 },
        );
        break;
      case 'phone':
        await this.phoneSmsQueue.add(
          'phone',
          {
            phone: numbers,
            code: code,
          },
          { delay: 3000, priority: 1 },
        );
      default:
        break;
    }
  }
}
