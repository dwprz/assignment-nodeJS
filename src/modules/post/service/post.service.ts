import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { ValidationService } from '../../../common/services/validation.service';
import { PostValidation } from '../validation/post.validation';
import { PostServiceUtil } from './post-service.util';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createPostWithoutContent(data: CreatePostRequest): Promise<Post> {
    data = this.validationService.validate(data, PostValidation.create);

    const post = await this.prismaService.post.create({
      data: data,
    });

    return post;
  }

  async createPostWithImages(data: CreatePostRequest): Promise<Post> {
    try {
      data = this.validationService.validate(data, PostValidation.create);

      const post = await this.prismaService.post.create({
        data: data,
      });

      return post;
    } catch (error) {
      PostServiceUtil.deleteFiles(data);

      const errorMessage = error.message || 'failed to create post with images';
      const errorStatus = error.status || 500;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  async createPostWithPdf(data: CreatePostRequest): Promise<Post> {
    try {
      data = this.validationService.validate(data, PostValidation.create);

      const post = await this.prismaService.post.create({
        data: data,
      });

      return post;
    } catch (error) {
      PostServiceUtil.deleteFiles(data);

      const errorMessage = error.message || 'failed to create post with pdf';
      const errorStatus = error.status || 500;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  async updateTitleOrBody(data: UpdatePostRequest): Promise<Post> {
    data = this.validationService.validate(data, PostValidation.update);

    const post = await this.prismaService.post.update({
      where: {
        postId: data.postId,
        userName: data.userName,
      },
      data: {
        ...data,
        edited: true,
      },
    });

    return post;
  }

  async getRandomForLoggedInUser(
    data: GetRandomLoggedInUserRequest,
  ): Promise<Post[]> {
    data = this.validationService.validate(
      data,
      PostValidation.getRandomLoggedInUser,
    );

    const take = 10;
    const skip = (data.page - 1) * take;

    const posts = (await this.prismaService.$queryRaw`
    SELECT *, FALSE as liked
      FROM  posts 
    ORDER BY RANDOM()
      LIMIT ${take} OFFSET ${skip};`) as Post[];

    if (!posts.length) {
      return [];
    }

    const postIds = posts.map((postData) => postData.postId);

    const postsLikes = await PostServiceUtil.getPostsLikesByPostId(
      this.prismaService,
      postIds,
    );

    const postsComments = await PostServiceUtil.getPostsCommentsByPostId(
      this.prismaService,
      postIds,
    );

    const likedPostsByUser = await PostServiceUtil.getLikedPostsByUser(
      this.prismaService,
      postIds,
      data.userName,
    );

    const processedPost = PostServiceUtil.processingPostsForLogedInUser(
      posts,
      postsLikes,
      postsComments,
      likedPostsByUser,
    );

    return processedPost;
  }

  async getRandomForUnauthenticatedUser(page: number): Promise<Post[]> {
    page = this.validationService.validate(page, PostValidation.page);

    const take = 10;
    const skip = (page - 1) * take;

    const posts = (await this.prismaService.$queryRaw`
    SELECT *, FALSE as liked
      FROM  posts 
    ORDER BY RANDOM()
      LIMIT ${take} OFFSET ${skip};`) as Post[];

    if (!posts.length) {
      return [];
    }

    const postIds = posts.map((postData) => postData.postId);

    const postsLikes = await PostServiceUtil.getPostsLikesByPostId(
      this.prismaService,
      postIds,
    );

    const postsComments = await PostServiceUtil.getPostsCommentsByPostId(
      this.prismaService,
      postIds,
    );

    const processedPosts =
      PostServiceUtil.processingPostsForUnauthenticatedUser(
        posts,
        postsLikes,
        postsComments,
      );

    return processedPosts;
  }

  async getByUser(data: GetPostsByUser): Promise<Post[]> {
    data = this.validationService.validate(data, PostValidation.getByUser);

    const take = 10;
    const skip = (data.page - 1) * take;

    const posts = (await this.prismaService.$queryRaw`
    SELECT *
      FROM posts 
    WHERE 
      "userName" = ${data.userName}
    LIMIT 
      ${take} OFFSET ${skip};`) as Post[];

    if (!posts.length) {
      return [];
    }

    const postIds = posts.map((postData) => postData.postId);

    const postsLikes = await PostServiceUtil.getPostsLikesByPostId(
      this.prismaService,
      postIds,
    );

    const postsComments = await PostServiceUtil.getPostsCommentsByPostId(
      this.prismaService,
      postIds,
    );

    const likedPostsByUser = await PostServiceUtil.getLikedPostsByUser(
      this.prismaService,
      postIds,
      data.userName,
    );

    const processedPosts = PostServiceUtil.processingPostsForLogedInUser(
      posts,
      postsLikes,
      postsComments,
      likedPostsByUser,
    );

    return processedPosts;
  }
}
