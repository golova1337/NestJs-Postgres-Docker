import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmojiLogger } from 'src/common/logger/EmojiLogger';

@Processor('email-sms')
export class EmailConsumer {
  private readonly logger = new EmojiLogger();
  constructor(
    private readonly mailService: MailerService,
    private configService: ConfigService,
  ) {}
  @Process('email')
  async sendEmail(job: Job) {
    await this.mailService
      .sendMail({
        from: process.env.MAIL_USER,
        to: job.data.email,
        subject: 'Invitation',
        html: `<p>Please verify your email by clicking the following link: <a href="${process.env.HOST}:${process.env.PORT}/verify?code=${job.data.code}">Verify Email</a></p>`,
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }
}
