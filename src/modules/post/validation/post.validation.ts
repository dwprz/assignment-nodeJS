import { ZodType, z } from 'zod';

export class PostValidation {
  static readonly create: ZodType = z.object({
    userName: z.string(),
    title: z.string().max(100),
    body: z.string(),
    contents: z.array(z.string()).max(5).optional(),
  });

  static readonly update: ZodType = z.object({
    postId: z.number().min(1),
    title: z.string().max(100).optional(),
    body: z.string().optional(),
    userName: z.string(),
  });

  static readonly page: ZodType = z.number().min(1).max(100);

  static readonly getRandomLoggedInUser: ZodType = z.object({
    userName: z.string(),
    page: z.number().min(1),
  });

  static readonly getByUser: ZodType = z.object({
    userName: z.string(),
    page: z.number().min(1).max(1),
  });
}
