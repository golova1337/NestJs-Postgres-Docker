import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: MyLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(req.originalUrl);

    next();
  }
}
