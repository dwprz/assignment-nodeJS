import * as fs from 'fs';
import * as fileType from 'file-type';
import 'dotenv/config';
import { UserValidationRequest } from 'src/interfaces/user';

export class userControllerUtil {
  static async validateImage(file: Express.Multer.File): Promise<boolean> {
    const buffer = fs.readFileSync(file.path);

    const type = await fileType.fromBuffer(buffer);

    const isValidateImage =
      type.mime === 'image/jpeg' || type.mime === 'image/png';

    if (!isValidateImage) {
      fs.unlinkSync(file.path);
    }

    return isValidateImage;
  }

  static processingUpdatePhotoProfileRequest(req: UserValidationRequest) {
    const { id: userId, userName, role } = req.userData;
    const port = process.env.APP_PORT;
    const host = process.env.APP_HOST;
    const protocol = process.env.APP_PROTOCOL;
    const photoProfileName = req.file.filename;

    const photoProfile = `${protocol}://${host}:${port}/images/users/${photoProfileName}`;

    const photoProfilePath = req.file.path;

    const updateReq = {
      ...req.body,
      userId,
      userName,
      role,
      photoProfile,
      photoProfilePath,
    };

    return updateReq;
  }
}
