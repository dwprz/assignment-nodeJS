import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from '../../admin/service/admin.service';
import { UserService } from '../../user/service/user.service';

@Controller()
export class TokenController {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
  ) {}

  @Post('/api/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, role } = req['verificationResult'];

    const result =
      role === 'USER'
        ? await this.userService.processingRefreshToken(refreshToken)
        : await this.adminService.processingRefreshToken(refreshToken);

    res.cookie('accessToken', result.accessToken);
    res.status(200).json({ message: 'success refresh token' });
  }
}
