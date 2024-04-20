import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { UserValidationRequest } from 'src/interfaces/user';
import { LikeService } from '../service/like.service';
import { Response } from 'express';

@Controller()
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('/api/posts/:postId/likes')
  async userPostLike(@Req() req: UserValidationRequest, @Res() res: Response) {
    const { userName } = req.userData;
    const postId = Number(req.params['postId']);

    const result = await this.likeService.createPostLike({
      userName,
      postId,
    });

    res.status(201).json({ data: result });
  }

  @Get('/api/posts/:postId/likes')
  async listUsernamesOfPostLikers(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const postId = Number(req.params['postId']);

    const result = await this.likeService.getListUsernamesOfPostLikers(postId);
    res.status(200).json({ data: result });
  }

  @Delete('/api/posts/:postId/likes')
  async userPostUnlike(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { userName } = req.userData;
    const postId = Number(req.params['postId']);

    await this.likeService.deletePostLike({
      userName,
      postId,
    });

    res.status(200).json({ message: 'post unliked successfully' });
  }

  @Post('/api/posts/current/comments/:commentId/likes')
  async userPostCommentLike(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { id: userId } = req.userData;
    const commentId = Number(req.params['commentId']);

    const result = await this.likeService.createPostCommentLike({
      userId,
      commentId,
    });

    res.status(201).json({ data: result });
  }

  @Delete('/api/posts/current/comments/:commentId/likes')
  async userPostCommentUnlike(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { id: userId } = req.userData;
    const commentId = Number(req.params['commentId']);

    await this.likeService.deletePostCommentLike({
      userId,
      commentId,
    });

    res.status(200).json({ message: 'comment unliked successfully' });
  }

  @Post('/api/posts/current/comments/current/sub-comments/:subCommentId/likes')
  async userPostSubCommentLike(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { id: userId } = req.userData;
    const subCommentId = Number(req.params['subCommentId']);

    const result = await this.likeService.createPostSubCommentLike({
      userId,
      subCommentId,
    });

    res.status(201).json({ data: result });
  }

  @Delete(
    '/api/posts/current/comments/current/sub-comments/:subCommentId/likes',
  )
  async userPostSubCommentUnlike(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { id: userId } = req.userData;
    const subCommentId = Number(req.params['subCommentId']);

    await this.likeService.deletePostSubCommentLike({
      userId,
      subCommentId,
    });

    res.status(200).json({ message: 'sub comment unliked successfully' });
  }
}
