import HappyFamily from '../models/HappyFamily.js';
import { deleteHappyFamilyFile } from '../utils/fileHelper.js';

export const listHappyFamilies = async (_req, res, next) => {
  try {
    const families = await HappyFamily.find().sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: families });
  } catch (err) {
    next(err);
  }
};

export const createHappyFamily = async (req, res, next) => {
  try {
    const family = await HappyFamily.create(req.body);
    res.status(201).json({ success: true, data: family });
  } catch (err) {
    next(err);
  }
};

export const updateHappyFamily = async (req, res, next) => {
  try {
    const family = await HappyFamily.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!family) return res.status(404).json({ success: false, message: 'Happy family not found' });
    res.json({ success: true, data: family });
  } catch (err) {
    next(err);
  }
};

export const deleteHappyFamily = async (req, res, next) => {
  try {
    const family = await HappyFamily.findById(req.params.id);
    if (!family) return res.status(404).json({ success: false, message: 'Happy family not found' });
    deleteHappyFamilyFile(family);
    await family.deleteOne();
    res.json({ success: true, data: { message: 'Happy family deleted' } });
  } catch (err) {
    next(err);
  }
};
