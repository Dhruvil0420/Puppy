import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deleteFromCloudinary } from './cloudinaryUpload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

/**
 * Delete a file that lives under /uploads/... (legacy local disk)
 * @param {string} urlPath  e.g. "/uploads/images/abc.jpg"
 */
export function deleteFile(urlPath) {
  if (!urlPath || !urlPath.startsWith('/uploads/')) return;
  const abs = path.join(ROOT, 'public', urlPath);
  fs.unlink(abs, () => {}); // fire-and-forget
}

/** Remove every image and video file referenced by a Puppy document (Cloudinary + local). */
export function deletePuppyFiles(puppy) {
  if (!puppy) return;

  if (Array.isArray(puppy.images)) {
    puppy.images.forEach((img) => {
      if (img.publicId) {
        deleteFromCloudinary(img.publicId, 'image');
      } else if (img.url) {
        deleteFile(img.url);
      }
    });
  }

  // Also check if primaryImage / photos contain publicIds or Cloudinary URLs
  if (Array.isArray(puppy.photos)) {
    puppy.photos.forEach((photo) => {
      if (typeof photo === 'object' && photo?.publicId) {
        deleteFromCloudinary(photo.publicId, 'image');
      }
    });
  }

  if (puppy.videoPublicId) {
    deleteFromCloudinary(puppy.videoPublicId, 'video');
  }
}

/** Remove the image file referenced by a HappyFamily document (Cloudinary + local). */
export function deleteHappyFamilyFile(doc) {
  if (!doc) return;
  if (doc.publicId) {
    deleteFromCloudinary(doc.publicId, 'image');
  } else if (doc.imageUrl) {
    deleteFile(doc.imageUrl);
  }
}
