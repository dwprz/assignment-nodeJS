/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import {
  User,
  UserLoginRequest,
  UserRegisterRequest,
  UserUpdateRequest,
  UserWithAccessToken,
  UserWithTokens,
} from 'src/interfaces/user';
import { UserValidation } from '../validation/user.validation';
import { PrismaService } from '../../../common/services/prisma.service';
import { ValidationService } from '../../../common/services/validation.service';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { UserServiceUtil } from './user-service.util';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createUser(data: UserRegisterRequest): Promise<User> {
    data = this.validationService.validate(data, UserValidation.register);
    const findUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            userName: data.userName,
          },
          {
            email: data.email,
          },
        ],
      },
    });

    if (findUser) {
      throw new HttpException('user already exist', 409);
    }

    const { password, refreshToken, ...user } =
      await this.prismaService.user.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
        },
      });

    return user;
  }

  async processingLogin(data: UserLoginRequest): Promise<UserWithTokens> {
    data = this.validationService.validate(data, UserValidation.login);

    const findUser = await this.prismaService.user.findFirst({
      where: {
        userName: data.userName,
      },
    });

    if (!findUser) {
      throw new HttpException('user not found', 404);
    }

    const comparePasswords = await bcrypt.compare(
      data.password,
      findUser.password,
    );

    if (!comparePasswords) {
      throw new HttpException('password is invalid', 401);
    }

    const { newAccessToken, newRefreshToken } =
      UserServiceUtil.createAccessTokenAndRefreshToken(
        findUser.userId,
        findUser.userName,
        findUser.role,
      );

    const { password, refreshToken, ...userData } =
      await this.prismaService.user.update({
        where: {
          userName: data.userName,
        },
        data: {
          refreshToken: newRefreshToken,
        },
      });

    return {
      data: userData,
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async setNullRefreshToken(userId: number): Promise<string | null> {
    const { refreshToken } = await this.prismaService.user.update({
      where: {
        userId: userId,
      },
      data: {
        refreshToken: null,
      },
    });

    return refreshToken;
  }

  async getCurrentUser(userId: number): Promise<User> {
    const findUser = await this.prismaService.user.findUnique({
      where: { userId: userId },
    });

    if (!findUser) {
      throw new HttpException('user not found', 404);
    }

    const { password, refreshToken, ...user } = findUser;

    return user;
  }

  async update(data: UserUpdateRequest): Promise<UserWithTokens> {
    data = this.validationService.validate(data, UserValidation.update);

    const findUser = await this.prismaService.user.findUnique({
      where: {
        userId: data.userId,
      },
    });

    if (!findUser) {
      throw new HttpException('user not found', 404);
    }

    const comparePasswords = await bcrypt.compare(
      data.password,
      findUser.password,
    );

    if (!comparePasswords) {
      throw new HttpException('pasword is invalid', 401);
    }

    if (data.newUserName) {
      const { newAccessToken, newRefreshToken } =
        UserServiceUtil.createAccessTokenAndRefreshToken(
          data.userId,
          data.newUserName,
          data.role,
        );

      const userData = await UserServiceUtil.updateRelatedUserName(
        this.prismaService,
        data,
        newRefreshToken,
      );

      return {
        data: userData,
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    }

    if (data.newPassword) {
      return await UserServiceUtil.updatePassword(this.prismaService, data);
    }

    const { password, refreshToken, ...user } =
      await this.prismaService.user.update({
        where: {
          userId: data.userId,
        },
        data: { ...data, password: findUser.password },
      });

    return { data: user };
  }

  async updatePhotoProfile(data: UserUpdateRequest): Promise<User> {
    try {
      data = this.validationService.validate(
        data,
        UserValidation.updatePhotoProfile,
      );

      const findUser = await this.prismaService.user.findUnique({
        where: {
          userId: data.userId,
        },
      });

      if (!findUser) {
        throw new HttpException('user not found', 404);
      }

      if (findUser.photoProfile) {
        await UserServiceUtil.deletePhotoProfile(findUser.photoProfile);
      }

      const { password, refreshToken, ...user } =
        await this.prismaService.user.update({
          where: {
            userId: data.userId,
          },
          data: {
            photoProfile: data.photoProfile,
          },
        });

      return user;
    } catch (error) {
      fs.unlinkSync(data.photoProfilePath);

      const errorMessage = error.message || 'failed to update photo profile';
      const errorStatus = error.status || 500;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  async removePhotoProfile(userId: number): Promise<string | null> {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!findUser) {
      throw new HttpException('user not found', 404);
    }

    if (findUser.photoProfile) {
      await UserServiceUtil.deletePhotoProfile(findUser.photoProfile);
    }

    const { photoProfile } = await this.prismaService.user.update({
      where: {
        userId: userId,
      },
      data: {
        photoProfile: null,
      },
    });

    return photoProfile;
  }

  async processingRefreshToken(
    refreshToken: string,
  ): Promise<UserWithAccessToken> {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!findUser) {
      throw new HttpException('user not found', 404);
    }

    const { password, refreshToken: existingRefreshToken, ...user } = findUser;

    const accessToken = UserServiceUtil.createAccessToken(user);

    return { data: user, accessToken: accessToken };
  }
}
