import { ZodType, z } from 'zod';

export class LikeValidation {
  static readonly createPostLike: ZodType = z.object({
    userName: z.string(),
    postId: z.number().min(1),
  });

  static readonly deletePostLike: ZodType = z.object({
    userName: z.string(),
    postId: z.number().min(1),
  });

  static readonly createPostCommentLike: ZodType = z.object({
    userId: z.number(),
    commentId: z.number().min(1),
  });

  static readonly deletePostCommentLike: ZodType = z.object({
    userId: z.number(),
    commentId: z.number().min(1),
  });

  static readonly createPostSubCommentLike: ZodType = z.object({
    userId: z.number(),
    subCommentId: z.number().min(1),
  });

  static readonly deletePostSubCommentLike: ZodType = z.object({
    userId: z.number(),
    subCommentId: z.number().min(1),
  });
}
