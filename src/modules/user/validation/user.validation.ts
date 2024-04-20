import z, { ZodType } from 'zod';

export class UserValidation {
  static readonly register: ZodType = z.object({
    userName: z.string().min(5).max(100).regex(/^\S+$/),
    firstName: z.string().min(3).max(100).regex(/^\S+$/),
    lastName: z.string().min(3).max(100).regex(/^\S+$/).nullable().optional(),
    email: z.string().min(5).max(100).regex(/^\S+$/),
    password: z.string().min(5).max(100),
  });

  static readonly login: ZodType = z.object({
    userName: z.string(),
    password: z.string().min(5),
  });

  static readonly update: ZodType = z.object({
    userId: z.number().min(1),
    userName: z.string(),
    role: z.string(),
    newUserName: z.string().min(3).max(100).regex(/^\S+$/).optional(),
    firstName: z.string().min(3).max(100).regex(/^\S+$/).optional(),
    lastName: z.string().min(3).max(100).regex(/^\S+$/).optional(),
    email: z.string().min(5).max(100).regex(/^\S+$/).optional(),
    password: z.string().min(5),
    newPassword: z.string().min(5).max(100).optional(),
  });

  static readonly updatePhotoProfile: ZodType = z.object({
    userId: z.number().min(1),
    userName: z.string(),
    role: z.string(),
    photoProfile: z.string().max(200),
    photoProfilePath: z.string(),
  });
}
