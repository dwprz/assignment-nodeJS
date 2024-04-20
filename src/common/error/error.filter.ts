import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    console.log(status, exception.message, '| this error filter log');

    switch (status) {
      case 400:
        response.status(status).json({ error: 'bad request' });
        break;
      case 401:
        response.status(status).json({ error: exception.message });
        break;
      case 403:
        response.status(status).json({ error: 'access denied' });
        break;
      case 404:
        response.status(status).json({ error: exception.message });
        break;
      case 409:
        response.status(status).json({ error: exception.message });
        break;
      default:
        response.status(500).json({
          error:
            'sorry, an internal error occurred on the server. please try again later!',
        });
        break;
    }
  }
}
