import { ZodType, z } from 'zod';

export class FollowValidation {
  static readonly createUserFollow: ZodType = z.object({
    followerUserName: z.string(),
    followingUserName: z.string(),
  });

  static readonly deleteUserFollow: ZodType = z.object({
    followerUserName: z.string(),
    followingUserName: z.string(),
  });
}
