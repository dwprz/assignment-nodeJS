import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { UserValidationRequest } from 'src/interfaces/user';
import { FollowService } from '../service/follow.service';
import { Response } from 'express';

@Controller('/api/users')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post('/current/followings/:userName')
  async followUser(@Req() req: UserValidationRequest, @Res() res: Response) {
    const followingUserName = req.params['userName'];
    const followerUserName = req.userData.userName;

    const result = await this.followService.createUserFollow({
      followingUserName,
      followerUserName,
    });

    res.status(201).json({ data: result });
  }

  @Delete('/current/followings/:userName')
  async unfollowUser(@Req() req: UserValidationRequest, @Res() res: Response) {
    const followingUserName = req.params['userName'];
    const followerUserName = req.userData.userName;

    await this.followService.deleteUserFollow({
      followingUserName,
      followerUserName,
    });

    res.status(200).json({ message: 'unfollowed user successfully' });
  }

  @Get('/:userName/followers')
  async getFollowersByUser(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const userName = req.params['userName'];

    const result = await this.followService.getFollowersByUser(userName);
    res.status(200).json({ data: result });
  }

  @Get('/:userName/followings')
  async getFollowingsByUser(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const userName = req.params['userName'];

    const result = await this.followService.getFollowingsByUser(userName);
    res.status(200).json({ data: result });
  }
}
