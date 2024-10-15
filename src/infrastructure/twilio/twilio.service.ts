import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import {
  MessageInstance,
  MessageListInstanceCreateOptions,
} from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class CustomTwilioService {
  constructor(private readonly twilioService: TwilioService) {}
  async sendSMS(
    params: MessageListInstanceCreateOptions,
    callback?: (error: Error | null, item?: MessageInstance) => any,
  ): Promise<MessageInstance> {
    if (callback) {
      return this.twilioService.client.messages.create(params, callback);
    } else {
      return this.twilioService.client.messages.create(params);
    }
  }
}
