import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { UserTestUtil } from '../user/user-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/post/get-posts-for-loged-in-user.spec.ts

describe('GET /api/posts/only-logged-in', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());

    await app.init();

    userTestUtil = app.get(UserTestUtil);
  });

  beforeEach(async () => {
    await userTestUtil.create();
  });

  afterEach(async () => {
    await userTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Getting posts should succeed', async () => {
    // login
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    // get posts
    const result = await supertest(app.getHttpServer())
      .get('/api/posts/only-logged-in?page=2')
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('Getting posts should fail if page param is invalid', async () => {
    // login
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    // get posts
    const result = await supertest(app.getHttpServer())
      .get('/api/posts/only-logged-in?page=INVALID PAGE PARAM')
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
