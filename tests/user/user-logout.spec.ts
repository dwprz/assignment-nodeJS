import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { UserTestUtil } from './user-test.util';
import { TestModule } from '../test.module';
import * as cookieParser from 'cookie-parser';

// npx jest tests/user/user-logout.spec.ts

describe('PATCH /api/users/current/logout', () => {
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

  it('The user logout should succeed', async () => {
    // login
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookies = loginRes.get('Set-Cookie');

    // logout
    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current/logout')
      .set('Cookie', cookies);

    expect(result.status).toBe(200);
    expect(result.body.refreshToken).toBe(null);
  });

  it('The user logout should fail if the accessToken is invalid', async () => {
    // login
    await supertest(app.getHttpServer()).post('/api/users/login').send({
      userName: 'USERTEST123',
      password: 'PASSWORD TEST',
    });

    // logout
    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current/logout')
      .set('Cookie', ["accessToken='INVALID ACCESS TOKEN'"]);

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
