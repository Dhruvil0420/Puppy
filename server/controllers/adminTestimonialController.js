import Testimonial from '../models/Testimonial.js';

export const listTestimonials = async (_req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: { message: 'Testimonial deleted' } });
  } catch (err) {
    next(err);
  }
};
