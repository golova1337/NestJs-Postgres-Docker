import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class SendCodeService {
  constructor(
    @InjectQueue('sent-sms') private queue: Queue,
    private readonly logger: MyLogger,
  ) {}

  async send(messageParams: any) {
    const { registrationMethod, email, phone, otp } = messageParams;

    switch (registrationMethod) {
      case 'email':
        await this.queue.add(
          'email-sms',
          {
            email: email,
            otp: otp,
          },
          { delay: 3000, priority: 1, removeOnComplete: true },
        );
        break;
      case 'phone':
        await this.queue.add(
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
