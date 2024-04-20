import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../../../../src/app.module';
import { TestModule } from '../../../../test.module';
import { UserTestUtil } from '../../../../user/user-test.util';
import { PostTestUtil } from '../../../post-test.util';
import * as cookieParser from 'cookie-parser';
import { LikeTestUtil } from '../like-test.util';

// npx jest tests/post/sub-test/like/post/get-post-likes.spec.ts

describe('GET /api/posts/:postId/likes', () => {
  let app: INestApplication;
  let userTestUtil: UserTestUtil;
  let postTestUtil: PostTestUtil;
  let likeTestUtil: LikeTestUtil;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());

    await app.init();

    userTestUtil = app.get(UserTestUtil);
    postTestUtil = app.get(PostTestUtil);
    likeTestUtil = app.get(LikeTestUtil);
  });

  beforeEach(async () => {
    await userTestUtil.create();
  });

  afterEach(async () => {
    await likeTestUtil.removePostLikes();
    await postTestUtil.remove();
    await userTestUtil.remove();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Getting likes for the post must succeed', async () => {
    const loginRes = await supertest(app.getHttpServer())
      .post('/api/users/login')
      .send({
        userName: 'USERTEST123',
        password: 'PASSWORD TEST',
      });

    const cookieAccessToken = loginRes.get('Set-Cookie');

    const { postId } = await postTestUtil.create();

    const result = await supertest(app.getHttpServer())
      .get(`/api/posts/${postId}/likes`)
      .set('Cookie', cookieAccessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it('Getting likes for the post must fail without an accessToken Cookie', async () => {
    await supertest(app.getHttpServer()).post('/api/users/login').send({
      userName: 'USERTEST123',
      password: 'PASSWORD TEST',
    });

    const result = await supertest(app.getHttpServer()).get(
      `/api/posts/INVALID POST ID/likes`,
    );

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
