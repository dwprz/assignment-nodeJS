import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { UserTestUtil } from '../user/user-test.util';
import { PostTestUtil } from './post-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/post/create-post-without-contents.spec.ts

describe('POST /api/posts', () => {
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

  it('Creating post without content should succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .post('/api/posts')
      .send({
        title: 'TITLE TEST',
        body: 'BODY TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
  });

  it('Creating post without content should fail without cookie accessToken', async () => {
    const result = await supertest(app.getHttpServer())
      .post('/api/posts')
      .send({
        title: 'TITLE TEST',
        body: 'BODY TEST',
      });

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
