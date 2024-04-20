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

// npx jest post/sub-test/comment/sub-comment/edit-sub-comment.spec.ts

describe('PATCH /api/posts/current/comments/current/sub-comments/:subCommentId', () => {
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

  it('Editing sub comment should succeed', async () => {
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
      .patch(`/api/posts/current/comments/current/sub-comments/${subCommentId}`)
      .send({
        comment: 'NEW SUB COMMENT TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
  });

  it('Editing sub comment should fail if sub commentId is invalid', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .patch(
        `/api/posts/current/comments/current/sub-comments/INVALID COMMENT ID`,
      )
      .send({
        comment: 'NEW SUB COMMENT TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
