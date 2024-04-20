import { Module } from '@nestjs/common';
import { LikeService } from './service/like.service';
import { LikeController } from './controller/like.controller';

@Module({
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
