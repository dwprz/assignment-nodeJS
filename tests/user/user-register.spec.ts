import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { UserTestUtil } from './user-test.util';

// npx jest tests/user/user-register.spec.ts

describe('POST /api/users/register', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userTestUtil = app.get(UserTestUtil);
  });

  afterEach(async () => {
    await userTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('The user register should succeed', async () => {
    const result = await supertest(app.getHttpServer())
      .post('/api/users/register')
      .send({
        userName: 'USERTEST123',
        firstName: 'USER',
        lastName: 'TEST',
        email: 'USERTEST@MAIL.COM',
        password: 'PASSWORD TEST',
      });

    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
  });

  it('The user register should fail if the input is invalid', async () => {
    const result = await supertest(app.getHttpServer())
      .post('/api/users/register')
      .send({
        userName: 'INVALID USERNAME',
        firstName: 'USER',
        lastName: 'TEST',
        email: 'USERTEST@MAIL.COM',
        password: 'PASSWORD TEST',
      });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
