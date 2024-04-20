import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../../../src/app.module';
import { TestModule } from '../../../test.module';
import { UserTestUtil } from '../../../user/user-test.util';
import { PostTestUtil } from '../../post-test.util';
import * as cookieParser from 'cookie-parser';
import { CommentTestUtil } from './comment-test.util';

// npx jest tests/post/sub-test/comment/create-comment.spec.ts

describe('POST /api/posts/:postId/comments', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;
  let postTestUtil: PostTestUtil;
  let commentTestUtil: CommentTestUtil;

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
  });

  beforeEach(async () => {
    await userTestUtil.create();
  });

  afterEach(async () => {
    await commentTestUtil.remove();
    await postTestUtil.remove();
    await userTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Creating comment should succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const { postId } = await postTestUtil.create();

    const result = await supertest(app.getHttpServer())
      .post(`/api/posts/${postId}/comments`)
      .send({
        comment: 'COMMENT TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
  });

  it('Creating comment should fail if postId is invalid', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .post(`/api/posts/INVALID POST ID/comments`)
      .send({
        comment: 'COMMENT TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
