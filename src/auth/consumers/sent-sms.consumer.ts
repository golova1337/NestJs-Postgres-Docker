import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { NodemailerService } from 'src/infrastructure/nodemailer/nodemailer.service';
import { CustomTwilioService } from 'src/infrastructure/twilio/twilio.service';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@Processor('sent-sms')
export class SentSmsConsumer extends WorkerHost {
  constructor(
    private readonly configService: ConfigService,
    private readonly nodemailerService: NodemailerService,
    private readonly customTwilioService: CustomTwilioService,
    private readonly logger: MyLogger,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'email-sms':
        {
          await this.nodemailerService.sendMail({
            from: this.configService.get('nodemailer.user'),
            to: job.data.email,
            subject: 'Invitation',
            html: `<p>Please verify your email by clicking the following link: <a href="${this.configService.get('HOST')}:${this.configService.get('PORT')}/${this.configService.get('VERSION')}/verify?code=${job.data.otp}">Verify Email</a></p>`,
          });
        }
        break;
      case 'phone-sms':
        {
          await this.customTwilioService.sendSMS({
            body: job.data.otp,
            to: job.data.phone,
            from: this.configService.get('twilio.numbers'),
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
  @OnWorkerEvent('completed')
  onCompleted(job: Job, prev) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}, completed `,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job, error, prev) {
    this.logger.error(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}, error ${error.message}`,
    );
  }
}
