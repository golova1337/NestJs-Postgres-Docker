import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';

export class EmojiLogger implements LoggerService {
  log(message: string) {
    this.writeToFile('📢 ' + message);
  }

  error(message: string) {
    this.writeToFile('❌ ' + message);
  }

  warn(message: string) {
    this.writeToFile('⚠️ ' + message);
  }

  debug(message: string) {
    this.writeToFile('🐞 ' + message);
  }

  private writeToFile(message: string) {
    console.log(message);
    const logEntry = { timestamp: new Date(), message };
    fs.appendFileSync('app.log', `${JSON.stringify(logEntry)}\n`);
  }
}
