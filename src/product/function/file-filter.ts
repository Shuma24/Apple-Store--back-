import { IMAGE_ONLY } from '../errors/prouct-error.constants';

export const checkImgFile = (req: any, file: any, callback: any) => {
  if (
    !file.mimetype.includes('image/png') &&
    !file.mimetype.includes('image/jpeg')
  ) {
    return callback(new Error(`${IMAGE_ONLY}`), false);
  }

  callback(null, true);
};
