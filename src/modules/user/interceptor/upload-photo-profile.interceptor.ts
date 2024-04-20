import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Injectable()
export class UploadPhotoPrifileInterceptor extends FileInterceptor(
  'photoProfile',
  {
    storage: multer.diskStorage({
      destination(req, file, callback) {
        callback(null, process.cwd() + '/public/images/users');
      },

      filename(req, file, callback) {
        const encodeName = file.originalname.replace(/[ %?#&=]/g, '-');
        callback(null, Date.now() + '-' + encodeName);
      },
    }),
  },
) {}
