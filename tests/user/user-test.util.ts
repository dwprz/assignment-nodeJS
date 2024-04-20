import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/common/services/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserTestUtil {
  constructor(private prismaService: PrismaService) {}

  async create() {
    try {
      await this.prismaService.user.create({
        data: {
          userName: 'USERTEST123',
          firstName: 'USER',
          lastName: 'TEST',
          email: 'USERTEST123@MAIL.COM',
          password: await bcrypt.hash('PASSWORD TEST', 10),
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async remove() {
    try {
      await this.prismaService.user.deleteMany({
        where: {
          OR: [
            {
              userName: 'USERTEST123',
            },
            {
              userName: 'USERTEST345',
            },
          ],
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async createMany() {
    try {
      await this.prismaService.user.createMany({
        data: [
          {
            userName: 'USERTEST123',
            firstName: 'USER',
            lastName: 'TEST',
            email: 'USERTEST123@MAIL.COM',
            password: await bcrypt.hash('PASSWORD TEST', 10),
          },
          {
            userName: 'USERTEST345',
            firstName: 'USER',
            lastName: 'TEST',
            email: 'USERTEST345@MAIL.COM',
            password: await bcrypt.hash('PASSWORD TEST', 10),
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async removeMany() {
    try {
      await this.prismaService.user.delete({
        where: {
          userName: 'USERTEST123',
        },
      });

      await this.prismaService.user.delete({
        where: {
          userName: 'USERTEST345',
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
