import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/common/services/prisma.service';

@Injectable()
export class PostTestUtil {
  constructor(private prismaService: PrismaService) {}

  async create() {
    try {
      const post = await this.prismaService.post.create({
        data: {
          userName: 'USERTEST123',
          title: 'TITLE TEST',
          body: 'BODY TEST',
        },
      });

      return post;
    } catch (error) {
      console.log(error.message);
    }
  }

  async remove() {
    try {
      await this.prismaService.post.deleteMany({
        where: {
          OR: [
            {
              title: 'TITLE TEST',
              body: 'BODY TEST',
            },
            {
              title: 'NEW TITLE TEST',
              body: 'NEW BODY TEST',
            },
          ],
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
