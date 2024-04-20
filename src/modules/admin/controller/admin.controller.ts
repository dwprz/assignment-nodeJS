import { Controller, Post, Req, Res } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { Request, Response } from 'express';

@Controller('/api/admins')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { data, tokens } = await this.adminService.processingLogin(req.body);

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.status(200).json({ data: data });
  }
}
