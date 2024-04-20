import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../../../../src/app.module';
import { TestModule } from '../../../../test.module';
import { UserTestUtil } from '../../../../user/user-test.util';
import { PostTestUtil } from '../../../post-test.util';
import * as cookieParser from 'cookie-parser';
import { CommentTestUtil } from '../comment-test.util';
import { SubCommentTestUtil } from './sub-comment-test.util';

// npx jest post/sub-test/comment/sub-comment/get-post-sub-comments.spec.ts

describe('GET /api/posts/current/comments/:commentId/sub-comments', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;
  let postTestUtil: PostTestUtil;
  let commentTestUtil: CommentTestUtil;
  let subCommentTestUtil: SubCommentTestUtil;

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
  });

  beforeEach(async () => {
    await userTestUtil.create();
  });

  afterEach(async () => {
    await subCommentTestUtil.remove();
    await commentTestUtil.remove();
    await postTestUtil.remove();
    await userTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Getting post sub comments should succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const { postId } = await postTestUtil.create();
    const { commentId } = await commentTestUtil.create(postId);
    await subCommentTestUtil.createMany(commentId);

    const result = await supertest(app.getHttpServer())
      .get(`/api/posts/current/comments/${commentId}/sub-comments`)

      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('Getting post sub comment should fail if commentId is invalid', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .get(`/api/posts/current/comments/INVALID COMMENT ID/sub-comments`)
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
