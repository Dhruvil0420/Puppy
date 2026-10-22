import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'teddypups';

/**
 * Upload a file Buffer directly to Cloudinary using upload_stream.
 */
export const uploadBuffer = (buffer, { resourceType = 'image', sub = 'puppies' } = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `${CLOUDINARY_FOLDER}/${sub}`,
      resource_type: resourceType,
    };

    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { width: 1600, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ];
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve({
        url: result.secure_url || result.url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        resourceType: result.resource_type,
      });
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Upload directly from a remote URL to Cloudinary.
 *
 * @param {string} url - Direct media file URL
 * @param {Object} options
 * @param {'image'|'video'} [options.resourceType='video']
 * @param {string} [options.sub='videos']
 * @returns {Promise<{ url: string, publicId: string, duration?: number, format?: string, bytes?: number, poster?: string }>}
 */
export const uploadFromUrl = async (url, { resourceType = 'video', sub = 'videos' } = {}) => {
  const options = {
    resource_type: resourceType,
    folder: `${CLOUDINARY_FOLDER}/${sub}`,
    timeout: 120000,
  };

  if (resourceType === 'video') {
    options.eager = [{ width: 1280, crop: 'limit', quality: 'auto', format: 'mp4' }];
    options.eager_async = true;
  } else if (resourceType === 'image') {
    options.transformation = [
      { width: 1600, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ];
  }

  const result = await cloudinary.uploader.upload(url, options);
  const secureUrl = result.secure_url || result.url;
  
  // Replace file extension with .jpg to obtain poster image for videos
  const poster = secureUrl ? secureUrl.replace(/\.[^/.]+$/, '.jpg') : undefined;

  return {
    url: secureUrl,
    publicId: result.public_id,
    duration: result.duration,
    format: result.format,
    bytes: result.bytes,
    poster,
  };
};

/**
 * Delete a media asset from Cloudinary using its public_id.
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn(`Failed to delete asset ${publicId} from Cloudinary:`, err.message);
    return null;
  }
};

/**
 * Permanently removes all Cloudinary image and video assets associated with a Puppy document.
 * @param {Object} puppy - Mongoose Puppy document or plain object
 */
export const deletePuppyFiles = (puppy) => {
  if (!puppy) return;

  if (Array.isArray(puppy.images)) {
    puppy.images.forEach((img) => {
      if (img?.publicId) {
        deleteFromCloudinary(img.publicId, 'image');
      }
    });
  }

  if (puppy.videoPublicId) {
    deleteFromCloudinary(puppy.videoPublicId, 'video');
  }
};

/**
 * Permanently removes a HappyFamily image from Cloudinary.
 * @param {Object} doc - Mongoose HappyFamily document or plain object
 */
export const deleteHappyFamilyFile = (doc) => {
  if (doc?.publicId) {
    deleteFromCloudinary(doc.publicId, 'image');
  }
};
