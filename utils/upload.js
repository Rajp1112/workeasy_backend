const multer = require('multer');
const path = require('path');

// Store files in memory (you can also use diskStorage)
const storage = multer.memoryStorage();

// File filter (optional, accept only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
