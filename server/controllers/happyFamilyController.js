import HappyFamily from '../models/HappyFamily.js';

// GET /api/happy-families
export const getHappyFamilies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [families, total] = await Promise.all([
      HappyFamily.find()
        .sort({ sortOrder: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      HappyFamily.countDocuments(),
    ]);

    res.json({
      success: true,
      data: families,
      meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};
