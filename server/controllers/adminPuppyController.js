import Puppy from '../models/Puppy.js';
import { deletePuppyFiles, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

/* ── GET /api/admin/puppies ────────────────────────────────────── */
export const listPuppies = async (req, res, next) => {
  try {
    const { q, status, breed, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (breed)  filter.breedGroups = breed;
    if (q) {
      filter.$or = [
        { name:         { $regex: q, $options: 'i' } },
        { breed:        { $regex: q, $options: 'i' } },
        { displayTitle: { $regex: q, $options: 'i' } },
      ];
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [rawPuppies, total] = await Promise.all([
      Puppy.find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Puppy.countDocuments(filter),
    ]);

    const puppies = rawPuppies.map((p) => {
      const photos = (p.images || []).map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
      return {
        ...p,
        photos,
        primaryImage: p.primaryImage || photos[0] || '',
      };
    });

    res.json({
      success: true,
      data: puppies,
      meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/admin/puppies/:id ────────────────────────────────── */
export const getPuppy = async (req, res, next) => {
  try {
    const puppy = await Puppy.findById(req.params.id);
    if (!puppy) return res.status(404).json({ success: false, message: 'Puppy not found' });
    res.json({ success: true, data: puppy });
  } catch (err) {
    next(err);
  }
};

/* ── POST /api/admin/puppies ───────────────────────────────────── */
export const createPuppy = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.photos && !payload.images) {
      payload.images = payload.photos.map((p) => (typeof p === 'string' ? { url: p, publicId: '' } : p));
    }
    const puppy = await Puppy.create(payload);
    res.status(201).json({ success: true, data: puppy });
  } catch (err) {
    next(err);
  }
};

/* ── PUT /api/admin/puppies/:id ─────────────────────────────────── */
export const updatePuppy = async (req, res, next) => {
  try {
    const puppy = await Puppy.findById(req.params.id);
    if (!puppy) return res.status(404).json({ success: false, message: 'Puppy not found' });

    // If video is being changed or cleared, delete the old video asset from Cloudinary
    if (req.body.videoPublicId && puppy.videoPublicId && req.body.videoPublicId !== puppy.videoPublicId) {
      deleteFromCloudinary(puppy.videoPublicId, 'video');
    } else if (req.body.videoUrl === '' && puppy.videoPublicId) {
      deleteFromCloudinary(puppy.videoPublicId, 'video');
    }

    const payload = { ...req.body };
    if (payload.photos) {
      payload.images = payload.photos.map((p) => (typeof p === 'string' ? { url: p, publicId: '' } : p));
    }

    Object.assign(puppy, payload);
    await puppy.save();                        // triggers slug pre-save
    res.json({ success: true, data: puppy });
  } catch (err) {
    next(err);
  }
};

/* ── PATCH /api/admin/puppies/:id/status ───────────────────────── */
export const updatePuppyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['available', 'reserved', 'gone-home'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const puppy = await Puppy.findById(req.params.id);
    if (!puppy) return res.status(404).json({ success: false, message: 'Puppy not found' });

    puppy.status = status;
    puppy.goneHomeAt = status === 'gone-home' ? new Date() : undefined;
    await puppy.save();

    res.json({ success: true, data: puppy });
  } catch (err) {
    next(err);
  }
};

/* ── PATCH /api/admin/puppies/reorder ──────────────────────────── */
export const reorderPuppies = async (req, res, next) => {
  try {
    const { order } = req.body;                // [{ id, sortOrder }]
    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: '"order" must be an array' });
    }

    const ops = order.map(({ id, sortOrder }) => ({
      updateOne: { filter: { _id: id }, update: { sortOrder } },
    }));
    await Puppy.bulkWrite(ops);

    res.json({ success: true, data: { message: 'Reorder complete' } });
  } catch (err) {
    next(err);
  }
};

/* ── DELETE /api/admin/puppies/:id ─────────────────────────────── */
export const deletePuppy = async (req, res, next) => {
  try {
    const puppy = await Puppy.findById(req.params.id);
    if (!puppy) return res.status(404).json({ success: false, message: 'Puppy not found' });

    deletePuppyFiles(puppy);
    await puppy.deleteOne();

    res.json({ success: true, data: { message: 'Puppy deleted' } });
  } catch (err) {
    next(err);
  }
};
