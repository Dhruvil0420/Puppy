import Puppy from '../models/Puppy.js';
import Enquiry from '../models/Enquiry.js';
import HappyFamily from '../models/HappyFamily.js';
import Testimonial from '../models/Testimonial.js';
import Faq from '../models/Faq.js';

// GET /api/admin/stats
export const getStats = async (_req, res, next) => {
  try {
    const [pA, pR, pG, eN, eC, eCl, hf, tm, fq] = await Promise.all([
      Puppy.countDocuments({ status: 'available' }),
      Puppy.countDocuments({ status: 'reserved' }),
      Puppy.countDocuments({ status: 'gone-home' }),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: 'contacted' }),
      Enquiry.countDocuments({ status: 'closed' }),
      HappyFamily.countDocuments(),
      Testimonial.countDocuments(),
      Faq.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        puppies: { available: pA, reserved: pR, goneHome: pG, total: pA + pR + pG },
        enquiries: { new: eN, contacted: eC, closed: eCl, total: eN + eC + eCl },
        happyFamilies: hf,
        testimonials: tm,
        faqs: fq,
      },
    });
  } catch (err) {
    next(err);
  }
};
