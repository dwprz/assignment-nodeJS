import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { UserTestUtil } from '../user/user-test.util';
import { PostTestUtil } from './post-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/post/edit-title-or-body-post.spec.ts

describe('PATCH /api/posts/:postId', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;
  let postTestUtil: PostTestUtil;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());

    await app.init();

    userTestUtil = app.get(UserTestUtil);
    postTestUtil = app.get(PostTestUtil);
  });

  beforeEach(async () => {
    await userTestUtil.create();
  });

  afterEach(async () => {
    await postTestUtil.remove();
    await userTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Editing post title or body should succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const { postId } = await postTestUtil.create();

    const result = await supertest(app.getHttpServer())
      .patch(`/api/posts/${postId}`)
      .send({
        title: 'NEW TITLE TEST',
        body: 'NEW BODY TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('Editing post title or body should fail if input is invalid', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const { postId } = await postTestUtil.create();

    const result = await supertest(app.getHttpServer())
      .patch(`/api/posts/${postId}`)
      .send({
        title: 12345,
        body: 'NEW BODY TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
