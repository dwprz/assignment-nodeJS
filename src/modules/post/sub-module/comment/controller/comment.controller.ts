import { Controller, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserValidationRequest } from 'src/interfaces/user';
import { CommentService } from '../service/comment.service';

@Controller()
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('/api/posts/:postId/comments')
  async userPostComment(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { userName } = req.userData;
    const postId = Number(req.params['postId']);

    const result = await this.commentService.createPostComment({
      ...req.body,
      postId,
      userName,
    });

    res.status(201).json({ data: result });
  }

  @Get('/api/posts/:postId/comments')
  async getPostComments(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { id: userId } = req.userData;
    const postId = Number(req.params['postId']);

    const result = await this.commentService.getPostComments({
      userId,
      postId,
    });

    res.status(200).json({ data: result });
  }

  @Patch('/api/posts/current/comments/:commentId')
  async editUserPostComment(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const commentId = Number(req.params['commentId']);

    const result = await this.commentService.updatePostComment({
      ...req.body,
      commentId,
    });

    res.status(200).json({ data: result });
  }

  @Post('/api/posts/current/comments/:commentId/sub-comments')
  async userPostSubComment(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { userName } = req.userData;
    const commentId = Number(req.params['commentId']);

    const result = await this.commentService.createPostSubComment({
      ...req.body,
      commentId,
      userName,
    });

    res.status(201).json({ data: result });
  }

  @Get('/api/posts/current/comments/:commentId/sub-comments')
  async getPostSubComments(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { id: userId } = req.userData;
    const commentId = Number(req.params['commentId']);

    const result = await this.commentService.getPostSubComments({
      userId,
      commentId,
    });

    res.status(200).json({ data: result });
  }

  @Patch('/api/posts/current/comments/current/sub-comments/:subCommentId')
  async editUserPostSubComment(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const subCommentId = Number(req.params['subCommentId']);

    const result = await this.commentService.updatePostSubComment({
      ...req.body,
      subCommentId,
    });

    res.status(201).json({ data: result });
  }
}
