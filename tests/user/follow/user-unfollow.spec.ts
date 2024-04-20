import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../../src/app.module';
import { TestModule } from '../../../tests/test.module';
import { UserTestUtil } from '../user-test.util';
import * as cookieParser from 'cookie-parser';
import { FollowTestUtil } from './user-follow.util';

// npx jest tests/user/follow/user-unfollow.spec.ts

describe('DELETE /api/users/current/followings/:userName', () => {
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

  it('Unfollowing the user should succeed', async () => {
    const followerUserName = 'USERTEST123';
    const followingUserName = `USERTEST345`;

    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: followerUserName,
        password: 'PASSWORD TEST',
      });

    const cookies = loginRes.get('Set-Cookie');

    await supertest(app.getHttpServer())
      .post(`/api/users/current/followings/${followingUserName}`)
      .set('Cookie', cookies);

    const result = await supertest(app.getHttpServer())
      .delete(`/api/users/current/followings/${followingUserName}`)
      .set('Cookie', cookies);

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
  });

  it('Unfollowing the user should fail', async () => {
    const followerUserName = 'USERTEST123';
    const followingUserName = `USERTEST345`;

    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: followerUserName,
        password: 'PASSWORD TEST',
      });

    const cookies = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .delete(`/api/users/current/followings/${followingUserName}`)
      .set('Cookie', cookies);

    expect(result.status).toBe(500);
    expect(result.body.error).toBeDefined();
  });
});
