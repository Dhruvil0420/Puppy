import { uploadBuffer, uploadFromUrl, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// URL validator helper to block private IPs and web page video links
function validateDirectMediaUrl(url, type = 'video') {
  if (!url || typeof url !== 'string') {
    return 'URL is required.';
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return 'Please provide a valid HTTP or HTTPS URL.';
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return 'Only HTTP and HTTPS URLs are allowed.';
  }

  const hostname = parsed.hostname.toLowerCase();

  // Reject localhost and private IP addresses
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('172.16.') ||
    hostname.endsWith('.local')
  ) {
    return 'Private or local addresses are not permitted.';
  }

  // Reject web page links
  const disallowedHosts = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be',
    'vimeo.com',
    'www.vimeo.com',
  ];
  if (disallowedHosts.includes(hostname) || parsed.pathname.includes('/video/')) {
    return 'Use a direct video file link (.mp4/.webm), not a YouTube or web page link.';
  }

  return null;
}

/* ── POST /api/admin/upload/images?sub=puppies|families ────────── */
export const handleImageUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided. Please select at least one image file.',
      });
    }

    const sub = req.query.sub === 'families' ? 'families' : 'puppies';

    const uploadPromises = req.files.map((file) =>
      uploadBuffer(file.buffer, { resourceType: 'image', sub })
    );

    const results = await Promise.all(uploadPromises);

    res.status(201).json({
      success: true,
      data: results.map((r) => ({
        url: r.url,
        publicId: r.publicId,
        width: r.width,
        height: r.height,
      })),
    });
  } catch (err) {
    next(err);
  }
};

/* ── POST /api/admin/upload/video ──────────────────────────────── */
export const handleVideoUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video provided. Please upload an MP4 or WEBM video file.',
      });
    }

    const result = await uploadBuffer(req.file.buffer, {
      resourceType: 'video',
      sub: 'videos',
    });

    res.status(201).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── POST /api/admin/upload/video-url body: { url } ─────────────── */
export const handleVideoUrlUpload = async (req, res, next) => {
  try {
    const { url } = req.body;
    const validationError = validateDirectMediaUrl(url, 'video');
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    let result;
    try {
      result = await uploadFromUrl(url, { resourceType: 'video', sub: 'videos' });
    } catch (err) {
      const msg = err.message || '';
      return res.status(400).json({
        success: false,
        message: `Failed to upload video from URL: ${msg}`,
      });
    }

    // Limit check: 30MB or duration > 60s
    if ((result.bytes && result.bytes > 30 * 1024 * 1024) || (result.duration && result.duration > 60)) {
      if (result.publicId) {
        await deleteFromCloudinary(result.publicId, 'video');
      }
      return res.status(400).json({
        success: false,
        message: 'Video too large or too long (maximum 30MB, 60 seconds).',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        poster: result.poster,
        duration: result.duration,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── POST /api/admin/upload/image-url body: { url, sub } ────────── */
export const handleImageUrlUpload = async (req, res, next) => {
  try {
    const { url, sub = 'puppies' } = req.body;
    const validationError = validateDirectMediaUrl(url, 'image');
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    let result;
    try {
      result = await uploadFromUrl(url, { resourceType: 'image', sub });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `Failed to upload image from URL: ${err.message || 'Source unreachable'}`,
      });
    }

    res.status(201).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── DELETE /api/admin/upload body: { publicId, resourceType } ─── */
export const handleDeleteUpload = async (req, res, next) => {
  try {
    const { publicId, resourceType = 'image' } = req.body;
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Missing publicId in request body.',
      });
    }

    await deleteFromCloudinary(publicId, resourceType);

    res.json({
      success: true,
      message: 'Asset deleted from Cloudinary successfully.',
    });
  } catch (err) {
    next(err);
  }
};
