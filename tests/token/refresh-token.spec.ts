import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { UserTestUtil } from '../user/user-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/token/refresh-token.spec.ts

describe('POST /api/refresh-token', () => {
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

  it('The token refresh should succeed', async () => {
    // login
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });
    const cookies = loginRes.get('Set-Cookie');

    // refresh token
    const result = await supertest(app.getHttpServer())
      .post('/api/refresh-token')
      .set('Cookie', cookies);

    expect(result.status).toBe(200);
    expect(result.get('Set-Cookie')).toBeDefined();
  });

  it('The token refresh should fail without refreshToken', async () => {
    // refresh token
    const result = await supertest(app.getHttpServer()).post(
      '/api/refresh-token',
    );

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
    expect(result.get('Set-Cookie')).toBeUndefined();
  });
});
