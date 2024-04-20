import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UserValidationRequest } from 'src/interfaces/user';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  use(req: UserValidationRequest, res: Response, next: NextFunction) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const acccessToken = req.cookies['accessToken'];

    if (!jwtSecretKey || !acccessToken) {
      throw new HttpException(
        'jwtSecretKey or accessToken is not provided',
        401,
      );
    }

    try {
      const userData = jwt.verify(acccessToken, jwtSecretKey) as JwtPayload;
      req.userData = userData;
      next();
    } catch (error) {
      throw new HttpException('token is invalid', 401);
    }
  }
}
