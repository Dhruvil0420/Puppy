import { Router } from 'express';
import { getSettings } from '../controllers/settingController.js';
import {
  getPuppies,
  getGoneHomePuppies,
  getPuppyBySlug,
} from '../controllers/puppyController.js';
import { getHappyFamilies } from '../controllers/happyFamilyController.js';
import { getTestimonials } from '../controllers/testimonialController.js';
import { getFaqs } from '../controllers/faqController.js';

const router = Router();

router.get('/settings',          getSettings);
router.get('/puppies',           getPuppies);
router.get('/puppies/gone-home', getGoneHomePuppies);
router.get('/puppies/:slug',     getPuppyBySlug);
router.get('/happy-families',    getHappyFamilies);
router.get('/testimonials',      getTestimonials);
router.get('/faqs',              getFaqs);

export default router;
