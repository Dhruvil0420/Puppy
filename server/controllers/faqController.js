import Faq from '../models/Faq.js';

// GET /api/faqs  (?home=true → only showOnHome)
export const getFaqs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.home === 'true') filter.showOnHome = true;

    const faqs = await Faq.find(filter).sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
};
