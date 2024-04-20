import { ZodType, z } from 'zod';

export class CommentValidation {
  static readonly createPostComment: ZodType = z.object({
    userName: z.string(),
    postId: z.number().min(1),
    comment: z.string(),
    tags: z.array(z.string()).max(10).optional(),
  });

  static readonly getPostComments: ZodType = z.object({
    userId: z.number(),
    postId: z.number().min(1),
  });

  static readonly updatePostComment: ZodType = z.object({
    commentId: z.number().min(1),
    comment: z.string().optional(),
    tags: z.array(z.string()).max(10).optional(),
  });

  static readonly createPostSubComment: ZodType = z.object({
    userName: z.string(),
    commentId: z.number().min(1),
    comment: z.string(),
    tags: z.array(z.string()).max(10).optional(),
  });

  static readonly getPostSubComments: ZodType = z.object({
    userId: z.number(),
    commentId: z.number().min(1),
  });

  static readonly updatePostSubComment: ZodType = z.object({
    subCommentId: z.number().min(1),
    comment: z.string().optional(),
    tags: z.array(z.string()).max(10).optional(),
  });
}
