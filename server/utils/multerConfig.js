import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

/* ── Ensure upload directories ─────────────────────────────────── */
const IMAGES_DIR = path.join(ROOT, 'public', 'uploads', 'images');
const VIDEOS_DIR = path.join(ROOT, 'public', 'uploads', 'videos');
[IMAGES_DIR, VIDEOS_DIR].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

/* ── Helpers ───────────────────────────────────────────────────── */
function uniqueName(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const id = crypto.randomBytes(8).toString('hex');
  cb(null, `${Date.now()}-${id}${ext}`);
}

/* ── Image upload (field "images", max 8, ≤ 5 MB) ─────────────── */
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGES_DIR),
  filename: uniqueName,
});

const imageFilter = (_req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Only jpg, png, webp, and avif images are allowed'), false);
};

export const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('images', 8);

/* ── Video upload (field "video", single, ≤ 30 MB) ─────────────── */
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, VIDEOS_DIR),
  filename: uniqueName,
});

const videoFilter = (_req, file, cb) => {
  const allowed = ['.mp4', '.webm'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Only mp4 and webm videos are allowed'), false);
};

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 30 * 1024 * 1024 },
}).single('video');
