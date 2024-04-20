import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../src/common/services/prisma.service';

@Injectable()
export class CommentTestUtil {
  constructor(private prismaService: PrismaService) {}

  async create(postId: number) {
    try {
      const comment = await this.prismaService.userPostComment.create({
        data: {
          userName: 'USERTEST123',
          postId: postId,
          comment: 'COMMENT TEST 1',
        },
      });

      return comment;
    } catch (error) {
      console.log(error.message);
    }
  }

  async createMany(postId: number) {
    try {
      await this.prismaService.userPostComment.createMany({
        data: [
          {
            userName: 'USERTEST123',
            postId: postId,
            comment: 'COMMENT TEST 1',
          },
          {
            userName: 'USERTEST123',
            postId: postId,
            comment: 'COMMENT TEST 2',
          },
          {
            userName: 'USERTEST123',
            postId: postId,
            comment: 'COMMENT TEST 3',
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async remove() {
    try {
      await this.prismaService.userPostComment.deleteMany({
        where: {
          userName: 'USERTEST123',
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
