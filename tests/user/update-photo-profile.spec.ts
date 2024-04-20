import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { UserTestUtil } from './user-test.util';
import * as cookieParser from 'cookie-parser';

// npx jest tests/user/update-photo-profile.spec.ts

describe('PATCH /api/users/current/photo-profile', () => {
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

  it('The photo profile update should succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current/photo-profile')
      .attach('photoProfile', __dirname + '/assets/kurma.jpg')
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('The photo profile update should fail if file is invalid', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const result = await supertest(app.getHttpServer())
      .patch('/api/users/current/photo-profile')
      .attach('photoProfile', __dirname + '/assets/invalid-file.jpg')
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
