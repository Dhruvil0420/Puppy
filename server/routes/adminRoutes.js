import { Router } from 'express';
import protect from '../middleware/protect.js';
import { uploadImages, uploadVideo } from '../middleware/upload.js';

import { getStats } from '../controllers/adminStatsController.js';

import * as puppyCtrl       from '../controllers/adminPuppyController.js';
import * as enquiryCtrl     from '../controllers/adminEnquiryController.js';
import * as familyCtrl      from '../controllers/adminHappyFamilyController.js';
import * as faqCtrl         from '../controllers/adminFaqController.js';
import * as testimonialCtrl from '../controllers/adminTestimonialController.js';
import * as settingCtrl     from '../controllers/adminSettingController.js';
import {
  handleImageUpload,
  handleVideoUpload,
  handleVideoUrlUpload,
  handleImageUrlUpload,
  handleDeleteUpload,
} from '../controllers/uploadController.js';

const router = Router();

/* Every admin route requires authentication */
router.use(protect);

/* ── Dashboard ─────────────────────────────────────────────────── */
router.get('/stats', getStats);

/* ── Puppies ───────────────────────────────────────────────────── */
router.patch('/puppies/reorder',      puppyCtrl.reorderPuppies);   // before :id
router.get('/puppies',                puppyCtrl.listPuppies);
router.post('/puppies',               puppyCtrl.createPuppy);
router.get('/puppies/:id',            puppyCtrl.getPuppy);
router.put('/puppies/:id',            puppyCtrl.updatePuppy);
router.patch('/puppies/:id/status',   puppyCtrl.updatePuppyStatus);
router.delete('/puppies/:id',         puppyCtrl.deletePuppy);

/* ── Enquiries ─────────────────────────────────────────────────── */
router.get('/enquiries/export.csv',   enquiryCtrl.exportEnquiriesCsv);  // before :id
router.get('/enquiries',              enquiryCtrl.listEnquiries);
router.get('/enquiries/:id',          enquiryCtrl.getEnquiry);
router.patch('/enquiries/:id',        enquiryCtrl.updateEnquiry);
router.delete('/enquiries/:id',       enquiryCtrl.deleteEnquiry);

/* ── Happy Families ────────────────────────────────────────────── */
router.get('/happy-families',         familyCtrl.listHappyFamilies);
router.post('/happy-families',        familyCtrl.createHappyFamily);
router.put('/happy-families/:id',     familyCtrl.updateHappyFamily);
router.delete('/happy-families/:id',  familyCtrl.deleteHappyFamily);

/* ── FAQs ──────────────────────────────────────────────────────── */
router.get('/faqs',                   faqCtrl.listFaqs);
router.post('/faqs',                  faqCtrl.createFaq);
router.put('/faqs/:id',               faqCtrl.updateFaq);
router.delete('/faqs/:id',            faqCtrl.deleteFaq);

/* ── Testimonials ──────────────────────────────────────────────── */
router.get('/testimonials',           testimonialCtrl.listTestimonials);
router.post('/testimonials',          testimonialCtrl.createTestimonial);
router.put('/testimonials/:id',       testimonialCtrl.updateTestimonial);
router.delete('/testimonials/:id',    testimonialCtrl.deleteTestimonial);

/* ── Settings ──────────────────────────────────────────────────── */
router.get('/settings',               settingCtrl.getSettings);
router.put('/settings',               settingCtrl.updateSettings);

/* ── Uploads ───────────────────────────────────────────────────── */
router.post('/upload/images',         uploadImages, handleImageUpload);
router.post('/upload/video',          uploadVideo, handleVideoUpload);
router.post('/upload/video-url',      handleVideoUrlUpload);
router.post('/upload/image-url',      handleImageUrlUpload);
router.delete('/upload',              handleDeleteUpload);

export default router;
