import Setting from '../models/Setting.js';

// GET /api/settings
export const getSettings = async (_req, res, next) => {
  try {
    const settings = await Setting.findOne().lean();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};
