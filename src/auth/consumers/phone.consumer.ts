import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';
import { Twilio } from 'twilio';

@Processor('phone-sms')
export class PhoneConsumer {
  private readonly logger = new EmojiLogger();
  private twilioClient: Twilio;
  constructor(private configService: ConfigService) {}
  accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
  authToken = this.configService.get('TWILIO_AUTH_TOKEN');
  numbers = this.configService.get('TWILIO_NUMBERS');

  @Process('phone')
  async sendEmail(job: Job) {
    this.twilioClient = new Twilio(this.accountSid, this.authToken);
    try {
      this.twilioClient = new Twilio(this.accountSid, this.authToken);
      await this.twilioClient.messages.create({
        body: job.data.code,
        to: job.data.phone,
        from: this.numbers,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
