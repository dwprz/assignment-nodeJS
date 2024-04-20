import { Module } from '@nestjs/common';
import { AdminTestUtil } from './admin/admin-test.util';
import { UserTestUtil } from './user/user-test.util';
import { FollowTestUtil } from './user/follow/user-follow.util';
import { PostTestUtil } from './post/post-test.util';
import { CommentTestUtil } from './post/sub-test/comment/comment-test.util';
import { SubCommentTestUtil } from './post/sub-test/comment/sub-comment/sub-comment-test.util';
import { LikeTestUtil } from './post/sub-test/like/like-test.util';

@Module({
  providers: [
    AdminTestUtil,
    UserTestUtil,
    FollowTestUtil,
    PostTestUtil,
    CommentTestUtil,
    SubCommentTestUtil,
    LikeTestUtil,
  ],
})
export class TestModule {}
