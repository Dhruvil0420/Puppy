import Testimonial from '../models/Testimonial.js';

// GET /api/testimonials  (?featured=true)
export const getTestimonials = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') filter.featured = true;

    const testimonials = await Testimonial.find(filter)
      .sort({ sortOrder: 1 })
      .lean();

    res.json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
};
