import { UserType } from '@enums/user-type';
import {
  NestMiddleware,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.user || get(req.user, 'type') !== UserType.ADMIN) {
      throw new UnauthorizedException();
    }

    next();
  }
}
