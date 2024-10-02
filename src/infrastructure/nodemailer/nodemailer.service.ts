import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(sendMailOptions: ISendMailOptions) {
    await this.mailService.sendMail(sendMailOptions);
  }
}
