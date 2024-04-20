import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { Request, Response } from 'express';
import { UserValidationRequest } from 'src/interfaces/user';
import { UploadPhotoPrifileInterceptor } from '../interceptor/upload-photo-profile.interceptor';
import { userControllerUtil } from './user-controller.util';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Req() req: Request, @Res() res: Response) {
    const registerReq = req.body;

    const result = await this.userService.createUser(registerReq);
    res.status(201).json({ data: result });
  }

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const loginReq = req.body;

    const { data, tokens } = await this.userService.processingLogin(loginReq);

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });

    res.status(200).json({ data: data });
  }

  @Patch('/current/logout')
  async logout(@Req() req: UserValidationRequest, @Res() res: Response) {
    const { id: userId } = req.userData;

    const refreshToken = await this.userService.setNullRefreshToken(userId);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(200).json({ refreshToken: refreshToken });
  }

  @Get('/current')
  async GetCurrentUser(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { id: userId } = req.userData;

    const result = await this.userService.getCurrentUser(userId);
    res.status(200).json({ data: result });
  }

  @Patch('/current')
  async update(@Req() req: UserValidationRequest, @Res() res: Response) {
    const { id: userId, userName, role } = req.userData;
    const updateReq = { ...req.body, userId, userName, role };

    const { data, tokens } = await this.userService.update(updateReq);

    if (tokens) {
      res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
      res.cookie('accessToken', tokens.accessToken, { httpOnly: true });

      res.status(200).json({ data: data });
      return;
    }

    res.status(200).json({ data: data });
  }

  @Patch('/current/photo-profile')
  @UseInterceptors(UploadPhotoPrifileInterceptor)
  async updatePhotoProfile(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const isValidImage = await userControllerUtil.validateImage(req.file);

    const updateReq =
      userControllerUtil.processingUpdatePhotoProfileRequest(req);

    if (isValidImage) {
      const result = await this.userService.updatePhotoProfile(updateReq);
      res.status(200).json({ data: result });
    } else {
      res.status(400).json({ error: 'The image is not in JPEG or PNG format' });
    }
  }

  @Delete('/current/photo-profile')
  async removePhotoProfile(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { id: userId } = req.userData;

    const result = await this.userService.removePhotoProfile(userId);
    res.status(200).json({ photoProfile: result });
  }
}
