import Multer from 'multer';
import path from 'path';

export default {
  storage: Multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      callback(
        null,
        `${path.basename(file.originalname, ext)}-${Date.now()}${ext}`
      );
    },
  }),
};
