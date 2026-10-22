import multer from 'multer';

// Central error handler – catches Mongoose, JWT, Multer, and generic errors
// and returns the standard { success, message, errors } envelope.

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  /* ── Multer Errors ──────────────────────────────────────────── */
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the allowed limit (5MB for images, 30MB for video).';
      errors = [{ field: err.field, message }];
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded. Maximum 8 images allowed at once.';
      errors = [{ field: err.field, message }];
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected upload field "${err.field}". Please use "images" for images or "video" for video.`;
      errors = [{ field: err.field, message }];
    } else {
      message = `Upload error: ${err.message}`;
      errors = [{ field: err.field, message }];
    }
  }

  /* ── Mongoose validation ────────────────────────────────────── */
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  /* ── Mongoose duplicate key (code 11000) ────────────────────── */
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field}`;
    errors = [{ field, message: `${field} already exists` }];
  }

  /* ── Mongoose CastError (bad ObjectId, etc.) ────────────────── */
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errors = [{ field: err.path, message }];
  }

  /* ── JWT errors ─────────────────────────────────────────────── */
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
