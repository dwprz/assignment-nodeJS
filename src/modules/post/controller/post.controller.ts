import {
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserValidationRequest } from 'src/interfaces/user';
import { PostService } from '../service/post.service';
import { UploadImagesInterceptor } from '../interceptor/upload-images.interceptor';
import { PostControllerUtil } from './post-controller.util';
import { UploadPdfInterceptor } from '../interceptor/upload-pdf.interceptor';

@Controller('/api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  async createPostWithoutContents(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { userName } = req.userData;

    const result = await this.postService.createPostWithoutContent({
      ...req.body,
      userName,
    });

    res.status(201).json({ data: result });
  }

  @Post('/with-images')
  @UseInterceptors(UploadImagesInterceptor)
  async createPostWithImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const isValidImages = await PostControllerUtil.validateImages(files);
    const postReq = PostControllerUtil.processingPostWithImagesRequest(
      req,
      files,
    );

    if (isValidImages) {
      const result = await this.postService.createPostWithImages(postReq);
      res.status(201).json({ data: result });
    } else {
      res.status(400).json({ error: 'The files is not in JPEG or PNG format' });
    }
  }

  @Post('/with-pdf')
  @UseInterceptors(UploadPdfInterceptor)
  async createPostWithPdf(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const isValidPdf = await PostControllerUtil.isValidatePdf(req.file);
    const postReq = PostControllerUtil.processingPostWithPdfRequest(req);

    if (isValidPdf) {
      const result = await this.postService.createPostWithPdf(postReq);
      res.status(201).json({ data: result });
    } else {
      res.status(400).json({ error: 'The file is not in PDF format' });
    }
  }

  @Patch('/:postId')
  async editTitleOrBody(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { userName } = req.userData;
    const postId = Number(req.params['postId']);
    const updateReq = { ...req.body, userName, postId };

    const result = await this.postService.updateTitleOrBody(updateReq);
    res.status(200).json({ data: result });
  }

  @Get('/only-logged-in')
  async getRandomForLoggedInUser(
    @Req() req: UserValidationRequest,
    @Res() res: Response,
  ) {
    const { userName } = req.userData;
    const page = Number(req.query['page']);

    const result = await this.postService.getRandomForLoggedInUser({
      userName,
      page,
    });

    res.status(200).json({ data: result });
  }

  @Get()
  async getRandomForUnauthenticatedUser(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const page = Number(req.query['page']);

    const result = await this.postService.getRandomForUnauthenticatedUser(page);
    res.status(200).json({ data: result });
  }

  @Get('/users/:userName')
  async getByUser(@Req() req: Request, @Res() res: Response) {
    const userName = req.params['userName'];
    const page = Number(req.query['page']);

    const result = await this.postService.getByUser({ userName, page });
    res.status(200).json({ data: result });
  }
}
