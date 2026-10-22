import { body } from 'express-validator';
import Enquiry from '../models/Enquiry.js';
import Puppy from '../models/Puppy.js';

/* ── Validation chain ──────────────────────────────────────────── */
export const enquiryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be 2-80 characters'),
  body('phone')
    .trim()
    .matches(/^[\d+\-\s]{6,20}$/)
    .withMessage('Phone must be 6-20 characters (digits, +, -, spaces)'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('area')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('Area must be under 80 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must be under 1000 characters'),
  body('source')
    .isIn(['contact', 'puppy'])
    .withMessage('Source must be "contact" or "puppy"'),
];

/* ── POST /api/enquiries ───────────────────────────────────────── */
export const createEnquiry = async (req, res, next) => {
  try {
    /* Honeypot: if the hidden "website" field is filled → fake success */
    if (req.body.website) {
      return res.status(201).json({
        success: true,
        data: { message: 'Thank you for your enquiry! We will get back to you soon.' },
      });
    }

    const { name, phone, email, area, message, source, puppySlug } = req.body;
    const doc = { name, phone, email, area, message, source };

    /* Attach puppy if enquiry is from a puppy page */
    if (source === 'puppy' && puppySlug) {
      const puppy = await Puppy.findOne({ slug: puppySlug });
      if (!puppy) {
        return res.status(404).json({ success: false, message: 'Puppy not found' });
      }
      if (puppy.status === 'gone-home') {
        return res.status(400).json({
          success: false,
          message: 'This puppy has already found a home',
        });
      }
      doc.puppy = puppy._id;
      doc.puppyName = puppy.name;
    }

    doc.ip = req.ip;
    doc.userAgent = req.get('user-agent');

    const enquiry = await Enquiry.create(doc);

    res.status(201).json({
      success: true,
      data: {
        message: 'Thank you for your enquiry! We will get back to you soon.',
        id: enquiry._id,
      },
    });
  } catch (err) {
    next(err);
  }
};
