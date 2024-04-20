import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/common/services/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminTestUtil {
  constructor(private prismaService: PrismaService) {}

  async create() {
    try {
      await this.prismaService.admin.create({
        data: {
          userName: 'ADMINTEST123',
          role: 'ADMIN',
          password: await bcrypt.hash('PASSWORD TEST', 10),
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async remove() {
    try {
      await this.prismaService.admin.delete({
        where: {
          userName: 'ADMINTEST123',
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
