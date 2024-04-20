import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { VerifyRefrehTokenMiddleware } from './middleware/verify-refresh-token.middleware.';
import { UserService } from '../user/service/user.service';
import { TokenController } from './controller/token.controller';
import { AdminService } from '../admin/service/admin.service';

@Module({
  controllers: [TokenController],
  providers: [UserService, AdminService],
})
export class TokenModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyRefrehTokenMiddleware)
      .forRoutes({ path: '/api/refresh-token', method: RequestMethod.POST });
  }
}
