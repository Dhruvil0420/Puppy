import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { enquiryValidation, createEnquiry } from '../controllers/enquiryController.js';
import validate from '../middleware/validate.js';

const router = Router();

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many enquiries, please try again later',
  },
});

router.post('/', enquiryLimiter, enquiryValidation, validate, createEnquiry);

export default router;
