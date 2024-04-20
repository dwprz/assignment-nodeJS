import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostController } from './controller/post.controller';
import { LikeModule } from './sub-module/like/like.module';
import { CommentModule } from './sub-module/comment/comment.module';

@Module({
  imports: [LikeModule, CommentModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
