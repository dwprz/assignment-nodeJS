import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

@Injectable()
export class VerifyRefrehTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const refreshToken = req.cookies['refreshToken'];

    if (!jwtSecretKey || !refreshToken) {
      throw new HttpException(
        'jwtSecretKey or refreshToken is not provided',
        401,
      );
    }

    try {
      const { role } = jwt.verify(refreshToken, jwtSecretKey) as JwtPayload;
      req['verificationResult'] = { refreshToken, role };
      next();
    } catch (error) {
      throw new HttpException('refreshToken is invalid', 401);
    }
  }
}
