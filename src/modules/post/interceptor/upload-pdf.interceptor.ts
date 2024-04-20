import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Injectable()
export class UploadPdfInterceptor extends FileInterceptor('pdf', {
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, process.cwd() + '/public/posts/pdf');
    },

    filename(req, file, callback) {
      const encodeName = file.originalname.replace(/[ %?#&=]/g, '-');
      callback(null, Date.now() + '-' + encodeName);
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 mb
  },
}) {}
