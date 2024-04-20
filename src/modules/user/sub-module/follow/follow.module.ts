import { Module } from '@nestjs/common';
import { FollowController } from './controller/follow.controller';
import { FollowService } from './service/follow.service';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
