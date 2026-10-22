import api from './api';

/**
 * Upload multiple images to Cloudinary via /api/admin/upload/images
 */
export async function uploadImages(files, sub = 'puppies', onProgress) {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const res = await api.post(`/admin/upload/images?sub=${sub}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return res.data?.data || [];
}

/**
 * Upload a single video (MP4/WEBM <=30MB)
 */
export async function uploadVideo(file, onProgress) {
  const formData = new FormData();
  formData.append('video', file);

  const res = await api.post('/admin/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return res.data?.data;
}

/**
 * Upload video from direct URL to Cloudinary
 * @param {string} url - Direct video URL (.mp4/.webm)
 * @returns {Promise<{ url: string, publicId: string, poster: string, duration?: number }>}
 */
export async function uploadVideoFromUrl(url) {
  const res = await api.post('/admin/upload/video-url', { url });
  return res.data?.data;
}

/**
 * Upload image from direct URL to Cloudinary
 * @param {string} url
 * @param {'puppies'|'families'} [sub='puppies']
 * @returns {Promise<{ url: string, publicId: string, width?: number, height?: number }>}
 */
export async function uploadImageFromUrl(url, sub = 'puppies') {
  const res = await api.post('/admin/upload/image-url', { url, sub });
  return res.data?.data;
}

/**
 * Delete an uploaded asset from Cloudinary
 */
export async function deleteUpload(publicId, resourceType = 'image') {
  const res = await api.delete('/admin/upload', {
    data: { publicId, resourceType },
  });
  return res.data;
}
