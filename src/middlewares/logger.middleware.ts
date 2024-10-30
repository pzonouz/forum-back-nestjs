import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const date = new Date();
    console.log(`${date}-${req.method}-${req.originalUrl}-${req.url}`);
    next();
  }
}
