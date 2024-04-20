/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaService } from 'src/common/services/prisma.service';
import { HttpException } from '@nestjs/common';
import { User, UserUpdateRequest } from 'src/interfaces/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as fs from 'fs';
import * as uuid from 'uuid';

export class UserServiceUtil {
  static createAccessTokenAndRefreshToken(
    id: number,
    userName: string,
    role: string,
  ) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
      throw new HttpException('jwtSecretKey is not provided', 500);
    }

    const NewAccessToken = jwt.sign(
      {
        id: id,
        userName: userName,
        role: role,
      },
      jwtSecretKey,
      { expiresIn: '30m' },
    );

    const newRefreshToken = jwt.sign(
      {
        uuid: uuid.v4(),
        role: role,
      },
      jwtSecretKey,
      { expiresIn: '30d' },
    );

    return {
      newAccessToken: NewAccessToken,
      newRefreshToken: newRefreshToken,
    };
  }

  static async updateRelatedUserName(
    prismaService: PrismaService,
    data: UserUpdateRequest,
    newRefreshToken: string,
  ) {
    try {
      await prismaService.$queryRaw`BEGIN TRANSACTION;`;

      // tidak perlu mengupdate tabel relasi nya karena default prisma menggunakan ON UPDATE CASCADE
      const { password, refreshToken, ...userData } =
        await prismaService.user.update({
          where: {
            userId: data.userId,
          },
          data: {
            userName: data.newUserName,
            refreshToken: newRefreshToken,
          },
        });

      await prismaService.$queryRaw`COMMIT TRANSACTION;`;
      return userData;
    } catch (error) {
      await prismaService.$queryRaw`ROLLBACK TRANSACTION;`;
      const errorMessage = error.message
        ? error.message
        : 'failed update username';

      const errorStatus = error.status ? error.status : 500;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  static async updatePassword(
    prismaService: PrismaService,
    data: UserUpdateRequest,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...user } = await prismaService.user.update(
      {
        where: {
          userId: data.userId,
        },
        data: {
          password: await bcrypt.hash(data.newPassword, 10),
        },
      },
    );

    return { data: user };
  }

  static async deletePhotoProfile(photoProfile: string) {
    const photoProfileName = photoProfile.split('/')[5];
    const path = process.cwd() + `/public/images/users/${photoProfileName}`;

    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  }

  static createAccessToken(user: User) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const accessToken = jwt.sign(
      {
        id: user.userId,
        userName: user.userName,
        role: user.role,
      },
      jwtSecretKey,
      { expiresIn: '30m' },
    );

    return accessToken;
  }
}
