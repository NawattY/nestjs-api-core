import {
  NestMiddleware,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@services/backend/share/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('authorization');

    if (!authorization || !(authorization as string).split(' ')[1]) {
      throw new UnauthorizedException();
    }

    const token = (authorization as string).split(' ')[1];
    const user = await this.authService.getUserByAccessToken(token);
    req.user = user;
    next();
  }
}
