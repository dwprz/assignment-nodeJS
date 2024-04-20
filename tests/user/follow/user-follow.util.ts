import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../src/common/services/prisma.service';

@Injectable()
export class FollowTestUtil {
  constructor(private prismaService: PrismaService) {}

  async create() {
    try {
      await this.prismaService.userFollow.create({
        data: {
          follower: 'USERTEST123',
          following: 'USERTEST345',
        },
      });
    } catch (error) {
      console.log('failed to create user follow');
    }
  }

  async remove() {
    try {
      await this.prismaService.userFollow.deleteMany({
        where: {
          OR: [
            {
              follower: 'USERTEST123',
            },
            {
              follower: 'USERTEST345',
            },
          ],
        },
      });
    } catch (error) {
      console.log('failed to delete user follow');
    }
  }
}
