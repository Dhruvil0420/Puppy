import Faq from '../models/Faq.js';

export const listFaqs = async (_req, res, next) => {
  try {
    const faqs = await Faq.find().sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
};

export const createFaq = async (req, res, next) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
};

export const updateFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
};

export const deleteFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: { message: 'FAQ deleted' } });
  } catch (err) {
    next(err);
  }
};
