import Setting from '../models/Setting.js';

// GET /api/admin/settings
export const getSettings = async (_req, res, next) => {
  try {
    const settings = await Setting.findOne().lean();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/settings
export const updateSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};
