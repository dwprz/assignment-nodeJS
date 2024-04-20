import * as fs from 'fs';
import * as fileType from 'file-type';
import { UserValidationRequest } from 'src/interfaces/user';
import 'dotenv/config';

export class PostControllerUtil {
  static async validateImages(files: Array<Express.Multer.File>) {
    const result = await Promise.all(
      files.map(async (file) => {
        const buffer = fs.readFileSync(file.path);
        const type = await fileType.fromBuffer(buffer);

        const isValidImage =
          type.mime === 'image/jpeg' || type.mime === 'image/png';

        return isValidImage;
      }),
    );

    const isValidImages = result.every((value) => value === true);

    if (!isValidImages) {
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }

    return isValidImages;
  }

  static processingPostWithImagesRequest(
    req: UserValidationRequest,
    files: Array<Express.Multer.File>,
  ) {
    const { userName } = req.userData;
    const protocol = process.env.APP_PROTOCOL;
    const host = process.env.APP_HOST;
    const port = process.env.APP_PORT;

    const contents = files.map((file) => {
      const fileName = file.filename;
      const imagePath = `${protocol}://${host}:${port}/posts/images/${fileName}`;
      return imagePath;
    });

    return { ...req.body, userName, contents };
  }

  static async isValidatePdf(file: Express.Multer.File) {
    const buffer = fs.readFileSync(file.path);
    const type = await fileType.fromBuffer(buffer);

    const isValidPdf = type.mime === 'application/pdf';

    if (!isValidPdf) {
      fs.unlinkSync(file.path);
    }

    return isValidPdf;
  }

  static processingPostWithPdfRequest(req: UserValidationRequest) {
    const { userName } = req.userData;
    const protocol = process.env.APP_PROTOCOL;
    const host = process.env.APP_HOST;
    const port = process.env.APP_PORT;
    const pdfName = req.file.filename;

    const pdfPath = `${protocol}://${host}:${port}/posts/pdf/${pdfName}`;

    return {
      ...req.body,
      userName,
      contents: [pdfPath],
    };
  }
}
