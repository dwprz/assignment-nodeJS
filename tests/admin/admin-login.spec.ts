import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { AdminTestUtil } from './admin-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/admin/admin-login.spec.ts

describe('POST /api/users/login', () => {
  let app: INestApplication;
  let adminTestUtil: AdminTestUtil;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());

    await app.init();

    adminTestUtil = app.get(AdminTestUtil);
  });

  beforeEach(async () => {
    await adminTestUtil.create();
  });

  afterEach(async () => {
    await adminTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('The admin login should succeed', async () => {
    const result = await supertest(app.getHttpServer())
      .post('/api/admins/login')
      .send({
        userName: 'ADMINTEST123',
        password: 'PASSWORD TEST',
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.get('Set-Cookie')).toBeDefined();
  });

  it('The admin login should fail', async () => {
    const result = await supertest(app.getHttpServer())
      .post('/api/admins/login')
      .send({
        userName: 'ADMINTEST123',
        password: 'IVALID PASSWORD',
      });

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
    expect(result.get('Set-Cookie')).toBeUndefined();
  });
});
