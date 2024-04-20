import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../../src/app.module';
import { TestModule } from '../../../tests/test.module';
import { UserTestUtil } from '../user-test.util';
import * as cookieParser from 'cookie-parser';
import { FollowTestUtil } from './user-follow.util';

// npx jest tests/user/follow/get-followings.spec.ts

describe('GET /api/users/:userName/followings', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;
  let followTestUtil: FollowTestUtil;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());

    await app.init();

    userTestUtil = app.get(UserTestUtil);
    followTestUtil = app.get(FollowTestUtil);
  });

  beforeEach(async () => {
    await userTestUtil.createMany();
  });

  afterEach(async () => {
    await followTestUtil.remove();
    await userTestUtil.removeMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Getting user followings should succeed', async () => {
    const followerUserName = 'USERTEST123';
    const followingUserName = `USERTEST345`;

    // login
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: followerUserName,
        password: 'PASSWORD TEST',
      });

    const cookies = loginRes.get('Set-Cookie');

    // following
    await supertest(app.getHttpServer())
      .post(`/api/users/current/followings/${followingUserName}`)
      .set('Cookie', cookies);

    // get followings
    const result = await supertest(app.getHttpServer())
      .get(`/api/users/${followerUserName}/followings`)
      .set('Cookie', cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('Getting user followings should fail without a cookie', async () => {
    const followerUserName = 'USERTEST123';
    const followingUserName = `USERTEST345`;

    // login
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: followerUserName,
        password: 'PASSWORD TEST',
      });

    const cookies = loginRes.get('Set-Cookie');

    // following
    await supertest(app.getHttpServer())
      .post(`/api/users/current/followings/${followingUserName}`)
      .set('Cookie', cookies);

    // get followings
    const result = await supertest(app.getHttpServer()).get(
      `/api/users/${followerUserName}/followings`,
    );

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
