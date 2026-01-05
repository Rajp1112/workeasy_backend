// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const uploadDir = path.join(__dirname, 'uploads');

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const base = path.basename(file.originalname, ext).replace(/\s+/g, '-');
//     cb(null, `${base}-${Date.now()}${ext}`);
//   },
// });

// function fileFilter(req, file, cb) {
//   const allowed = /jpg|jpeg|png|gif|webp/;
//   const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
//   const mimeOk = allowed.test(file.mimetype);
//   if (extOk && mimeOk) return cb(null, true);
//   cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp).'));
// }

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// cloudinary approach

// middleware/upload.js
import multer from 'multer';

// Memory storage—file stays in RAM, then we stream to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG/PNG/WebP images are allowed'));
    }
    cb(null, true);
  },
});
