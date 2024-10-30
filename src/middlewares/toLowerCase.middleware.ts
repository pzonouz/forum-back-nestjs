import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ObjectItemsToLowercase } from 'src/utils';

@Injectable()
export class ToLowerCaseMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    if (
      !(
        req.originalUrl.includes('/auth/') ||
        req.originalUrl.includes('/users/')
      )
    ) {
      req.body = ObjectItemsToLowercase(req.body);
    }
    next();
  }
}
