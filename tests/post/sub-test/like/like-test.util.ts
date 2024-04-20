import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../src/common/services/prisma.service';

@Injectable()
export class LikeTestUtil {
  constructor(private prismaService: PrismaService) {}

  async createPostLike(postId: number) {
    try {
      const comment = await this.prismaService.userPostLike.create({
        data: {
          userName: 'USERTEST123',
          postId: postId,
        },
      });

      return comment;
    } catch (error) {
      console.log(error.message);
    }
  }

  async removePostLikes() {
    try {
      await this.prismaService.userPostLike.deleteMany({
        where: {
          userName: 'USERTEST123',
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async removeCommentLikes() {
    try {
      await this.prismaService.userPostCommentLike.deleteMany({
        where: {
          user: {
            userName: 'USERTEST123',
          },
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async removeSubCommentLikes() {
    try {
      await this.prismaService.userPostSubCommentLike.deleteMany({
        where: {
          user: {
            userName: 'USERTEST123',
          },
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
