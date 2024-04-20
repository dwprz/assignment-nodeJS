import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { UserTestUtil } from './user-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/user/user-login.spec.ts

describe('POST /api/users/login', () => {
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

  it('The user login should succeed', async () => {
    const result = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.get('Set-Cookie')).toBeDefined();
  });

  it('The user login should fail', async () => {
    const result = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'IVALID PASSWORD',
      });

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
    expect(result.get('Set-Cookie')).toBeUndefined();
  });
});
