import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { ValidationService } from './services/validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error/error.filter';
import { VerifyTokenMiddleware } from './middlewares/verify-token.middleware';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path: '/api/posts', method: RequestMethod.GET })
      .forRoutes(
        { path: '/api/users/current', method: RequestMethod.ALL },
        { path: '/api/users/current*', method: RequestMethod.ALL },
        { path: '/api/users/:userName/*', method: RequestMethod.ALL },
        { path: '/api/posts*', method: RequestMethod.ALL },
      );
  }
}
