import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EmojiLogger } from 'src/common/logger/emojiLogger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger = new EmojiLogger();
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(req.originalUrl);

    next();
  }
}
