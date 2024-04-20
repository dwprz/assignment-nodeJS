import { Request } from 'express';

interface UserRegisterRequest {
  userName: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

interface UserLoginRequest {
  userName: string;
  password: string;
}

interface UserWithTokens {
  data: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

interface UserWithAccessToken {
  data: User;
  accessToken: string;
}

interface UserUpdateRequest {
  userId: number;
  userName: string;
  newUserName?: string;
  firstName?: string;
  lastName?: string;
  photoProfile?: string;
  photoProfilePath?: string;
  role: string;
  email?: string;
  password?: string;
  newPassword?: string;
}

interface User {
  userId: number;
  userName: string;
  firstName: string;
  lastName?: string;
  email: string;
  photoProfile?: string | null;
  role: string;
  createdAt: Date;
  updateAt?: Date | null;
}

interface UserValidationRequest extends Request {
  userData: JwtPayload;
}
