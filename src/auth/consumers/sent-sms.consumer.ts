import { MailerService } from '@nestjs-modules/mailer';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { EmojiLogger } from 'src/common/logger/emojiLogger';
import { Twilio } from 'twilio';

@Processor('sent-sms')
export class SentSmsConsumer extends WorkerHost {
  private readonly logger = new EmojiLogger();
  private twilioClient: Twilio;

  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.twilioClient = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'email-sms':
        {
          await this.mailService.sendMail({
            from: process.env.MAIL_USER,
            to: job.data.email,
            subject: 'Invitation',
            html: `<p>Please verify your email by clicking the following link: <a href="${process.env.HOST}:${process.env.PORT}/${process.env.VERSION}/verify?code=${job.data.otp}">Verify Email</a></p>`,
          });
        }
        break;
      case 'phone-sms':
        {
          await this.twilioClient.messages.create({
            body: job.data.otp,
            to: job.data.phone,
            from: process.env.TWILIO_NUMBERS,
          });
        }
        break;

      default:
        {
          this.logger.log(`the another Job name: ${job.name}`);
        }
        break;
    }
  }
  @OnWorkerEvent('active')
  onActive(job: Job, prev) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}... prec ${prev}`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job, error, prev) {
    this.logger.error(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}, error ${error.message}`,
    );
  }
}
