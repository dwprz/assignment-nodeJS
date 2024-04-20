import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../../../../src/app.module';
import { TestModule } from '../../../../test.module';
import { UserTestUtil } from '../../../../user/user-test.util';
import { PostTestUtil } from '../../../post-test.util';
import { CommentTestUtil } from '../../comment/comment-test.util';
import { LikeTestUtil } from '../like-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/post/sub-test/like/comment/unlike-comment.spec.ts

describe('DELETE /api/posts/current/comment/:commentId/likes', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;
  let postTestUtil: PostTestUtil;
  let commentTestUtil: CommentTestUtil;
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
    likeTestUtil = app.get(LikeTestUtil);
  });

  beforeEach(async () => {
    await userTestUtil.create();
  });

  afterEach(async () => {
    await likeTestUtil.removeCommentLikes();
    await commentTestUtil.remove();
    await postTestUtil.remove();
    await userTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Must successfully unlike the comment post', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const { postId } = await postTestUtil.create();
    const { commentId } = await commentTestUtil.create(postId);

    await supertest(app.getHttpServer())
      .post(`/api/posts/current/comments/${commentId}/likes`)
      .set('Cookie', cookieAccessToken);

    const result = await supertest(app.getHttpServer())
      .delete(`/api/posts/current/comments/${commentId}/likes`)
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
  });

  it('Must fail unlike the comment post if commentId is invalid', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');
    const { postId } = await postTestUtil.create();
    const { commentId } = await commentTestUtil.create(postId);

    await supertest(app.getHttpServer())
      .post(`/api/posts/current/comments/${commentId}/likes`)
      .set('Cookie', cookieAccessToken);

    const result = await supertest(app.getHttpServer())
      .delete(`/api/posts/current/comments/INVALID COMMENT ID/likes`)
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
