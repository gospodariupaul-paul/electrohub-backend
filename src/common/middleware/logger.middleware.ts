import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject('winston') private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.info(`${method} ${url} → ${statusCode}`);
    });

    next();
  }
}
