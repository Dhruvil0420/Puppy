import multer from 'multer';

// Use memory storage for Cloudinary streaming (no disk storage)
const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file format. Only JPEG, PNG, WEBP, and AVIF images are permitted.');
    error.status = 400;
    cb(error, false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowedMimeTypes = ['video/mp4', 'video/webm'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid video format. Only MP4 and WEBM videos are permitted.');
    error.status = 400;
    cb(error, false);
  }
};

// Image upload: up to 8 images, 5MB each
export const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 8,
  },
}).array('images', 8);

// Video upload: single video, 30MB
export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB
    files: 1,
  },
}).single('video');
