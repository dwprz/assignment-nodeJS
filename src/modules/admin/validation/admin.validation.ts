import { ZodType, z } from 'zod';

export class AdminValidation {
  static readonly login: ZodType = z.object({
    userName: z.string(),
    password: z.string(),
  });
}
