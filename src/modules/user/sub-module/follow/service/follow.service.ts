import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../common/services/prisma.service';
import { ValidationService } from '../../../../../common/services/validation.service';
import { FollowValidation } from '../validation/follow.validation';

@Injectable()
export class FollowService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createUserFollow(data: CreateUserFollowRequest): Promise<UserFollow> {
    try {
      data = this.validationService.validate(
        data,
        FollowValidation.createUserFollow,
      );

      const userFollow = await this.prismaService.userFollow.create({
        data: {
          follower: data.followerUserName,
          following: data.followingUserName,
        },
      });

      return userFollow;
    } catch (error) {
      const errorStatus = error.code === 'P2002' ? 409 : error.status || 500;

      const errorMessage =
        error.code === 'P2002'
          ? 'user already followed'
          : error.message || 'failed to following user';

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  async deleteUserFollow(data: DeleteUserFollowRequest): Promise<void> {
    data = this.validationService.validate(
      data,
      FollowValidation.deleteUserFollow,
    );

    await this.prismaService.userFollow.delete({
      where: {
        follower_following: {
          follower: data.followerUserName,
          following: data.followingUserName,
        },
      },
    });
  }

  async getFollowersByUser(userName: string): Promise<string[]> {
    const followers = await this.prismaService.userFollow.findMany({
      where: {
        following: userName,
      },
      select: {
        follower: true,
      },
    });

    return followers.map(({ follower }) => follower);
  }

  async getFollowingsByUser(userName: string): Promise<string[]> {
    const followings = await this.prismaService.userFollow.findMany({
      where: {
        follower: userName,
      },
      select: {
        following: true,
      },
    });

    return followings.map(({ following }) => following);
  }
}
