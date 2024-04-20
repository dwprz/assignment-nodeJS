import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';

// npx jest tests/post/get-posts-for-unautenticathed-user.spec.ts

describe('GET /api/posts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('getting posts should succeed', async () => {
    const result = await supertest(app.getHttpServer()).get(
      '/api/posts?page=1',
    );

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('Getting posts should fail if page params is invalid', async () => {
    const result = await supertest(app.getHttpServer()).get(
      '/api/posts?page=INVALID PAGE PARAMS',
    );

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
