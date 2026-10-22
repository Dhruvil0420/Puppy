import { deleteFromCloudinary } from './cloudinaryUpload.js';

/**
 * Permanently removes all Cloudinary image and video assets associated with a Puppy document.
 * @param {Object} puppy - Mongoose Puppy document or plain object
 */
export function deletePuppyFiles(puppy) {
  if (!puppy) return;

  // Delete all photos with Cloudinary publicIds
  if (Array.isArray(puppy.images)) {
    puppy.images.forEach((img) => {
      if (img?.publicId) {
        deleteFromCloudinary(img.publicId, 'image');
      }
    });
  }

  // Delete attached video from Cloudinary
  if (puppy.videoPublicId) {
    deleteFromCloudinary(puppy.videoPublicId, 'video');
  }
}

/**
 * Permanently removes a HappyFamily image from Cloudinary.
 * @param {Object} doc - Mongoose HappyFamily document or plain object
 */
export function deleteHappyFamilyFile(doc) {
  if (doc?.publicId) {
    deleteFromCloudinary(doc.publicId, 'image');
  }
}
