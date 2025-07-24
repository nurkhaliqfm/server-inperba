import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CacheControlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    next();
  }
}
