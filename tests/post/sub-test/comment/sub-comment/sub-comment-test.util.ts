import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../src/common/services/prisma.service';

@Injectable()
export class SubCommentTestUtil {
  constructor(private prismaService: PrismaService) {}

  async create(commentId: number) {
    try {
      const comment = await this.prismaService.userPostSubComment.create({
        data: {
          userName: 'USERTEST123',
          commentId: commentId,
          comment: 'SUB COMMENT TEST 1',
        },
      });

      return comment;
    } catch (error) {
      console.log(error.message);
    }
  }

  async createMany(commentId: number) {
    try {
      await this.prismaService.userPostSubComment.createMany({
        data: [
          {
            userName: 'USERTEST123',
            commentId: commentId,
            comment: 'SUB COMMENT TEST 1',
          },
          {
            userName: 'USERTEST123',
            commentId: commentId,
            comment: 'SUB COMMENT TEST 2',
          },
          {
            userName: 'USERTEST123',
            commentId: commentId,
            comment: 'SUB COMMENT TEST 3',
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async remove() {
    try {
      await this.prismaService.userPostSubComment.deleteMany({
        where: {
          userName: 'USERTEST123',
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
