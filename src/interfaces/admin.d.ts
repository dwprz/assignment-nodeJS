interface AdminLoginRequest {
  userName: string;
  password: string;
}

interface AdminWithTokens {
  data: AdminOutput;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

interface AdminWithAccessToken {
  data: AdminOutput;
  accessToken: string;
}

interface Admin {
  adminId: number;
  userName: string;
  role: string;
  createdAt: Date;
  updateAt?: Date | null;
}
