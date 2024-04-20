import { PrismaService } from 'src/common/services/prisma.service';
import { HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import 'dotenv/config';

export class AdminServiceUtil {
  static async createAccessTokenAndRefreshToken(
    prismaService: PrismaService,
    data: Admin,
  ) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
      throw new HttpException('jwtSecretKey is not provided', 500);
    }

    const NewAccessToken = jwt.sign(
      {
        id: data.adminId,
        userName: data.userName,
        role: data.role,
      },
      jwtSecretKey,
      { expiresIn: '30m' },
    );

    const newRefreshToken = jwt.sign(
      {
        uuid: uuid.v4(),
        role: data.role,
      },
      jwtSecretKey,
      { expiresIn: '30d' },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...admin } =
      await prismaService.admin.update({
        where: {
          userName: data.userName,
        },
        data: {
          refreshToken: newRefreshToken,
        },
      });

    return {
      admin: admin,
      accessToken: NewAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static createAccessToken(data: Admin) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const accessToken = jwt.sign(
      {
        id: data.adminId,
        userName: data.userName,
        role: data.role,
      },
      jwtSecretKey,
      { expiresIn: '30m' },
    );

    return accessToken;
  }
}
