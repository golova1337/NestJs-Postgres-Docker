import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmojiLogger } from 'src/common/logger/emojiLogger';

@Processor('email-sms')
export class EmailConsumer {
  private readonly logger = new EmojiLogger();

  constructor(private readonly mailService: MailerService) {}

  @Process('email')
  async sendEmail(job: Job) {
    await this.mailService
      .sendMail({
        from: process.env.MAIL_USER,
        to: job.data.email,
        subject: 'Invitation',
        html: `<p>Please verify your email by clicking the following link: <a href="${process.env.HOST}:${process.env.PORT}/${process.env.VERSION}/api/verify?code=${job.data.otp}">Verify Email</a></p>`,
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }
}
