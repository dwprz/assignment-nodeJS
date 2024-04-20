import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { UserTestUtil } from './user-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/user/update-user.spec.ts

describe('PATCH /api/users/current', () => {
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

  it('The user update should succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current')
      .send({
        firstName: 'NEWFIRSTNAME',
        password: 'PASSWORD TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('The user update should fail without password', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current')
      .send({
        firstName: 'NEWFIRSTNAME',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it('The user update should fail if input is invalid', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current')
      .send({
        firstName: 12345,
        password: 'PASSWORD TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it('The user password update should succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current')
      .send({
        password: 'PASSWORD TEST',
        newPassword: 'NEW PASSWORD',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('The username user update should succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current')
      .send({
        newUserName: 'USERTEST345',
        password: 'PASSWORD TEST',
      })
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.get('Set-Cookie')).toBeDefined();
  });
});
