/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { ValidationService } from '../../../common/services/validation.service';
import { AdminValidation } from '../validation/admin.validation';
import * as bcrypt from 'bcrypt';
import { AdminServiceUtil } from './admin-service.util';

@Injectable()
export class AdminService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async processingLogin(data: AdminLoginRequest): Promise<AdminWithTokens> {
    data = this.validationService.validate(data, AdminValidation.login);

    const findAdmin = await this.prismaService.admin.findFirst({
      where: {
        userName: data.userName,
      },
    });

    if (!findAdmin) {
      throw new HttpException('user not found', 404);
    }

    const comparePasswords = await bcrypt.compare(
      data.password,
      findAdmin.password,
    );

    if (!comparePasswords) {
      throw new HttpException('password is invalid', 401);
    }

    const { admin, accessToken, refreshToken } =
      await AdminServiceUtil.createAccessTokenAndRefreshToken(
        this.prismaService,
        findAdmin,
      );

    return {
      data: admin,
      tokens: { accessToken, refreshToken },
    };
  }

  async processingRefreshToken(
    refreshToken: string,
  ): Promise<AdminWithAccessToken> {
    const findAdmin = await this.prismaService.admin.findUnique({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!findAdmin) {
      throw new HttpException('admin not found', 404);
    }

    const {
      password,
      refreshToken: existingRefreshToken,
      ...adminData
    } = findAdmin;

    const accessToken = AdminServiceUtil.createAccessToken(adminData);

    return { data: adminData, accessToken: accessToken };
  }
}
