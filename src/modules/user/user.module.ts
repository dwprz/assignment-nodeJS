import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { FollowModule } from './sub-module/follow/follow.module';

@Module({
  imports: [FollowModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
