import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../common/services/prisma.service';
import { ValidationService } from '../../../../../common/services/validation.service';
import { CommentValidation } from '../validation/comment.validation';

@Injectable()
export class CommentService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createPostComment(
    data: CreatePostCommentRequest,
  ): Promise<PostComment> {
    data = this.validationService.validate(
      data,
      CommentValidation.createPostComment,
    );

    const postComment = await this.prismaService.userPostComment.create({
      data: data,
    });

    return postComment;
  }

  async getPostComments(data: getPostCommentsRequest): Promise<PostComment[]> {
    data = this.validationService.validate(
      data,
      CommentValidation.getPostComments,
    );

    const postComments = (await this.prismaService.$queryRaw`
    SELECT 
        upc.*, 
        CASE WHEN upcl."userId" IS NULL THEN FALSE ELSE TRUE 
        END as liked 
    FROM 
        "userPostComments" as upc
    LEFT JOIN 
        "userPostCommentLikes" as upcl ON upcl."commentId" = upc."commentId" AND upcl."userId" = ${data.userId}
    WHERE 
        "postId" = ${data.postId};`) as PostComment[];

    const totalSubCommentsData = (await this.prismaService.$queryRaw`
    SELECT 
        upc."commentId", 
        CAST(COUNT(upsc."subCommentId") as INTEGER) as "totalSubComments"
    FROM 
        "userPostComments" as upc
    LEFT JOIN 
        "userPostSubComments" as upsc ON upsc."commentId" = upc."commentId"
    WHERE 
        upc."postId" = ${data.postId}
    GROUP 
        BY upc."commentId";`) as PostTotalSubComments[];

    const processedPostComments = postComments.map((postComment) => {
      const { totalSubComments } = totalSubCommentsData.find(
        (subComment) => subComment.commentId === postComment.commentId,
      );

      return { ...postComment, totalSubComments };
    });

    return processedPostComments;
  }

  async updatePostComment(
    data: UpdatePostCommentRequest,
  ): Promise<PostComment> {
    data = this.validationService.validate(
      data,
      CommentValidation.updatePostComment,
    );

    const postComment = await this.prismaService.userPostComment.update({
      where: {
        commentId: data.commentId,
      },
      data: {
        ...data,
        edited: true,
      },
    });

    return postComment;
  }

  async createPostSubComment(
    data: CreatePostSubCommentRequest,
  ): Promise<PostSubComment> {
    data = this.validationService.validate(
      data,
      CommentValidation.createPostSubComment,
    );

    const postSubComment = await this.prismaService.userPostSubComment.create({
      data: data,
    });

    return postSubComment;
  }

  async getPostSubComments(
    data: GetPostSubCommentsRequest,
  ): Promise<PostSubComment[]> {
    data = this.validationService.validate(
      data,
      CommentValidation.getPostSubComments,
    );

    const postSubComments = (await this.prismaService.$queryRaw`
    SELECT 
        upsc.*, 
        CAST(COUNT(upscl."subCommentId") as INTEGER) as "totalSubCommentLikes",
        CASE 
            WHEN upscl."userId" IS NULL THEN FALSE 
            ELSE TRUE
        END as liked
    FROM 
        "userPostSubComments" as upsc
    LEFT JOIN 
        "userPostSubCommentLikes" as upscl ON upscl."subCommentId" = upsc."subCommentId" 
        AND upscl."userId" = ${data.userId}
    WHERE 
        upsc."commentId" = ${data.commentId}
    GROUP BY 
        upsc."subCommentId", upscl."userId";`) as PostSubComment[];

    return postSubComments;
  }

  async updatePostSubComment(
    data: UpdatePostSubCommentRequest,
  ): Promise<PostSubComment> {
    data = this.validationService.validate(
      data,
      CommentValidation.updatePostSubComment,
    );

    const postSubComment = await this.prismaService.userPostSubComment.update({
      where: {
        subCommentId: data.subCommentId,
      },
      data: {
        ...data,
        edited: true,
      },
    });

    return postSubComment;
  }
}
