import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../../../../src/app.module';
import { TestModule } from '../../../../test.module';
import { UserTestUtil } from '../../../../user/user-test.util';
import { PostTestUtil } from '../../../post-test.util';
import { CommentTestUtil } from '../../comment/comment-test.util';
import { SubCommentTestUtil } from '../../comment/sub-comment/sub-comment-test.util';
import { LikeTestUtil } from '../like-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/post/sub-test/like/sub-comment/like-sub-comment.spec.ts

describe('POST /api/posts/current/comment/current/sub-comments/:subCommentId/likes', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;
  let postTestUtil: PostTestUtil;
  let commentTestUtil: CommentTestUtil;
  let subCommentTestUtil: SubCommentTestUtil;
  let likeTestUtil: LikeTestUtil;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());

    await app.init();

    userTestUtil = app.get(UserTestUtil);
    postTestUtil = app.get(PostTestUtil);
    commentTestUtil = app.get(CommentTestUtil);
    subCommentTestUtil = app.get(SubCommentTestUtil);
    likeTestUtil = app.get(LikeTestUtil);
  });

  beforeEach(async () => {
    await userTestUtil.create();
  });

  afterEach(async () => {
    await likeTestUtil.removeSubCommentLikes();
    await subCommentTestUtil.remove();
    await commentTestUtil.remove();
    await postTestUtil.remove();
    await userTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Must successfully like the sub comment', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const { postId } = await postTestUtil.create();
    const { commentId } = await commentTestUtil.create(postId);
    const { subCommentId } = await subCommentTestUtil.create(commentId);

    const result = await supertest(app.getHttpServer())
      .post(
        `/api/posts/current/comments/current/sub-comments/${subCommentId}/likes`,
      )
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
  });

  it('Must fail like the sub comment if subCommentId is invalid', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .post(
        `/api/posts/current/comments/current/sub-comments/INVALID SUB COMMENT ID/likes`,
      )
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
