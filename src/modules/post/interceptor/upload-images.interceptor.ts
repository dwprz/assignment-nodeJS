import { Injectable } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Injectable()
export class UploadImagesInterceptor extends FilesInterceptor('images', 5, {
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, process.cwd() + '/public/posts/images');
    },

    filename(req, file, callback) {
      const encodeName = file.originalname.replace(/[ %?#&=]/g, '-');
      callback(null, Date.now() + '-' + encodeName);
    },
  }),

  limits: {
    fileSize: 1 * 1024 * 1024, // 1 mb
  },
}) {}
