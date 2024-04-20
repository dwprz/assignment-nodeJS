import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../common/services/prisma.service';
import { ValidationService } from '../../../../../common/services/validation.service';
import { LikeValidation } from '../validation/like.validation';

@Injectable()
export class LikeService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createPostLike(data: CreatePostLikeRequest): Promise<PostLike> {
    data = this.validationService.validate(data, LikeValidation.createPostLike);

    const postLike = await this.prismaService.userPostLike.create({
      data: data,
    });

    return postLike;
  }

  async getListUsernamesOfPostLikers(postId: number): Promise<string[]> {
    const listLikesOfPost = (await this.prismaService.$queryRaw`
    SELECT "userName" FROM "userPostLikes"
    WHERE "postId" = ${postId};
    `) as PostListLike[];

    return listLikesOfPost.map(({ userName }) => userName);
  }

  async deletePostLike(data: DeletePostLikeRequest): Promise<void> {
    data = this.validationService.validate(data, LikeValidation.deletePostLike);

    await this.prismaService.userPostLike.delete({
      where: {
        userName_postId: {
          userName: data.userName,
          postId: data.postId,
        },
      },
    });
  }

  async createPostCommentLike(
    data: CreatePostCommentLikeRequest,
  ): Promise<PostCommentLike> {
    data = this.validationService.validate(
      data,
      LikeValidation.createPostCommentLike,
    );

    const postCommentLike = await this.prismaService.userPostCommentLike.create(
      {
        data: data,
      },
    );

    return postCommentLike;
  }

  async deletePostCommentLike(
    data: DeletePostCommentLikeRequest,
  ): Promise<void> {
    data = this.validationService.validate(
      data,
      LikeValidation.deletePostCommentLike,
    );

    await this.prismaService.userPostCommentLike.delete({
      where: {
        userId_commentId: {
          userId: data.userId,
          commentId: data.commentId,
        },
      },
    });
  }

  async createPostSubCommentLike(
    data: CreatePostSubCommentLikeRequest,
  ): Promise<PostSubCommentLike> {
    data = this.validationService.validate(
      data,
      LikeValidation.createPostSubCommentLike,
    );

    const postSubCommentLike =
      await this.prismaService.userPostSubCommentLike.create({
        data: data,
      });

    return postSubCommentLike;
  }

  async deletePostSubCommentLike(
    data: DeletePostSubCommentLikeRequest,
  ): Promise<void> {
    data = this.validationService.validate(
      data,
      LikeValidation.deletePostSubCommentLike,
    );

    await this.prismaService.userPostSubCommentLike.delete({
      where: {
        userId_subCommentId: {
          userId: data.userId,
          subCommentId: data.subCommentId,
        },
      },
    });
  }
}
